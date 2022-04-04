import React, { FC, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import clsx from 'clsx';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import invitesService from '../../services/invitesService';
import {
  Grid,
  makeStyles,
  Theme,
  createStyles,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  ListSubheader,
  Collapse,
  IconButton,
} from '@material-ui/core';
import {
  ExpandMoreRounded,
  ExpandLessRounded,
  RefreshRounded,
} from '@material-ui/icons';

import withNavbar from '../../components/WithNavbar';
import { useInvites } from '../../contexts/invitesContext';
import { useAppProperties } from '../../contexts/appPropertiesContext';
import { PartnerInQueue, Invite } from '../../@types/interfaces';
import {
  DELETE,
  NO_INVITES,
  NUMBERS,
  PARTNER_QUEUE,
} from '../../config/textConstants';
import SecondaryPartnerListText from './SecondaryPartnerListText';
import PrimaryPartnerListText from './PrimaryPartnerListText';
import InviteUser from './InviteUser';
import ConfirmInviteDeleteDialog from '../../components/dialogs/ConfirmInviteDeleteDialog';

export const useInviteStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    // LAYOUT
    listContainer: {
      backgroundColor: '#fff',
      height: 'calc(100vh - 50px)',
    },
    invitesContainer: {
      padding: spacing(2),
    },
    subListContainer: {
      padding: 0,
    },
    queue: {
      overflow: 'auto',
      height: 'calc(100vh - 100px)',
    },
    // STYLING
    spinner: {
      marginTop: spacing(0.5),
      marginBottom: spacing(0.5),
      marginRight: spacing(2.75),
      marginLeft: spacing(2.75),
    },
    partnerId: {
      color: palette.grey[400],
    },
    invitesHeader: {
      backgroundColor: '#fff',
      borderLeft: `1px solid ${palette.grey[50]}`,
      borderRight: `1px solid ${palette.grey[50]}`,
    },
    noPadding: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    deleteButton: {
      color: palette.error.dark,
    },
  })
);

interface Capacity {
  maxActivities: number;
  currentActivities: number;
}

const InvitesPage: FC = () => {
  const classes = useInviteStyles();

  // ----------------------------- Component state ------------------------------ //
  const [selectedInviteId, setSelectedInviteId] = useState<
    number | undefined
  >();
  const [expandedInvite, setExpandedInvite] = useState<number | null>();
  const [currentPage, setCurrentPage] = useState(0);
  const queueDiv = useRef<HTMLDivElement>(null);

  // ----------------------------- Hooks ---------------------------------------- //
  const { inviteExpiryInterval } = useAppProperties();
  const {
    isFetchingPartnerQueue,
    isFetchingMoreQueue,
    isFetchingInvites,
    queuePageable,
    invitesPageable,
    refreshInvitesContext,
    fetchQueue,
    fetchMoreQueue,
    fetchInvites,
  } = useInvites();

  // ----------------------------- Component functions ------------------------- //

  const getExpiration = (invite: Invite) =>
    momentTZ
      .utc(invite.sentOn)
      .tz(momentTZ.tz.guess())
      .add(inviteExpiryInterval?.value, inviteExpiryInterval?.unit)
      .format('ddd, h:mm:ss a');

  const handleDeleteInvite = async (id: number) => {
    const response: AxiosResponse | undefined =
      await invitesService.deleteInvite(id);
    if (
      !!response &&
      !!refreshInvitesContext &&
      response.status === 200 &&
      response.data === 'Invite-Deleted'
    ) {
      refreshInvitesContext();
      setSelectedInviteId(undefined);
      alert(response.data);
    } else {
      setSelectedInviteId(undefined);
      alert(`failed to delete invite ${id}`);
    }
  };

  const refreshQueue = () => {
    if (!!fetchQueue) {
      fetchQueue();
      setCurrentPage(0);
      if (!!queueDiv.current) {
        queueDiv.current.scrollTop = 0;
      }
    }
  };

  // ----------------------------- Render ---------------------------------------- //

  const Capacity: FC<Capacity> = ({ maxActivities, currentActivities }) => (
    <Typography variant="caption">
      Capacity:
      <strong>{` ${maxActivities - currentActivities}`}</strong>
    </Typography>
  );

  return (
    <Grid container>
      <ConfirmInviteDeleteDialog
        isFetchingInvites={isFetchingInvites}
        selectedInviteId={selectedInviteId}
        handleClose={() => setSelectedInviteId(undefined)}
        handleDelete={() =>
          !!selectedInviteId && handleDeleteInvite(selectedInviteId)
        }
      />
      <Grid item xs={3}>
        <div className={classes.listContainer}>
          <List classes={{ root: classes.subListContainer }}>
            <ListItem>
              <ListItemText primary={PARTNER_QUEUE} />
              <ListItemSecondaryAction>
                {isFetchingPartnerQueue || isFetchingMoreQueue ? (
                  <IconButton edge="end">
                    <CircularProgress
                      color="primary"
                      size="18px"
                      thickness={4.5}
                    />
                  </IconButton>
                ) : (
                  <IconButton onClick={refreshQueue} edge="end">
                    <RefreshRounded color="primary" />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <div ref={queueDiv} className={classes.queue} id="scrollableDiv">
              {!!queuePageable ? (
                <InfiniteScroll
                  dataLength={queuePageable.content.length}
                  next={() => {
                    !!fetchMoreQueue && fetchMoreQueue(currentPage + 1);
                    setCurrentPage(currentPage + 1);
                  }}
                  hasMore={!queuePageable.last}
                  loader={<div />}
                  endMessage={
                    <Typography align="center" paragraph variant="caption">
                      End of queue
                    </Typography>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  {queuePageable.content.map((partner: PartnerInQueue) => {
                    const duration = moment.duration(
                      moment().diff(moment(partner.lastChatFinished))
                    );
                    return (
                      <ListItem
                        key={partner.id}
                        data-testid="partner-queue-list-item"
                      >
                        <ListItemText
                          disableTypography
                          primary={
                            <PrimaryPartnerListText
                              id={partner.id}
                              displayName={partner.displayName}
                            />
                          }
                          secondary={
                            <SecondaryPartnerListText
                              duration={duration}
                              currentActivities={
                                partner.currentNumberOfActivities
                              }
                              maxActivities={partner.maxNumberOfActivities}
                            />
                          }
                        />
                      </ListItem>
                    );
                  })}
                </InfiniteScroll>
              ) : (
                <div />
              )}
            </div>
          </List>
        </div>
      </Grid>
      <Grid item xs={6}>
        <List
          classes={{
            root: clsx(classes.subListContainer, classes.invitesHeader),
          }}
        >
          <ListItem ContainerProps={{ id: 'partner-queue-header' }}>
            <ListItemText primary="Invites" />
            <ListItemSecondaryAction>
              {isFetchingInvites ? (
                <IconButton edge="end">
                  <CircularProgress
                    color="primary"
                    size="18px"
                    thickness={4.5}
                  />
                </IconButton>
              ) : (
                <IconButton onClick={fetchInvites} edge="end">
                  <RefreshRounded color="primary" />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </List>
        <div className={classes.queue}>
          <Grid
            classes={{ root: classes.invitesContainer }}
            container
            spacing={2}
            justifyContent="space-evenly"
          >
            {invitesPageable?.content.length === 0 ? (
              <p>{NO_INVITES}</p>
            ) : (
              invitesPageable?.content.map((invite: Invite) => (
                <Grid key={uuid()} item xs={12} md={12} lg={6}>
                  <Card>
                    <CardContent>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body1" color="primary">
                          <span
                            className={classes.partnerId}
                          >{`[${invite.id}] `}</span>
                          <strong>{invite.topic}</strong>
                        </Typography>
                        {invite.id === expandedInvite ? (
                          <IconButton
                            onClick={() => setExpandedInvite(null)}
                            aria-label="show more"
                          >
                            <ExpandLessRounded />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => setExpandedInvite(invite.id)}
                            aria-label="show more"
                          >
                            <ExpandMoreRounded />
                          </IconButton>
                        )}
                      </Grid>
                      <Divider />
                      <Collapse
                        in={invite.id === expandedInvite}
                        timeout="auto"
                      >
                        <List dense disablePadding>
                          <ListItem
                            key={uuid()}
                            classes={{ root: classes.noPadding }}
                          >
                            <ListItemText
                              disableTypography
                              primary={
                                <InviteUser
                                  designation="L"
                                  id={invite.learner.id}
                                  displayName={invite.learner.displayName}
                                />
                              }
                              secondary={
                                <Capacity
                                  maxActivities={
                                    invite.learner.maxNumberOfActivities
                                  }
                                  currentActivities={
                                    invite.learner.currentNumberOfActivities
                                  }
                                />
                              }
                            />
                          </ListItem>
                          {invite.partners.map((partner: PartnerInQueue) => {
                            const duration = moment.duration(
                              moment().diff(moment(partner.lastChatFinished))
                            );
                            return (
                              <ListItem
                                key={uuid()}
                                classes={{ root: classes.noPadding }}
                              >
                                <ListItemText
                                  disableTypography
                                  primary={
                                    <InviteUser
                                      designation="P"
                                      id={partner.id}
                                      displayName={partner.displayName}
                                    />
                                  }
                                  secondary={
                                    <Grid
                                      container
                                      justifyContent="space-between"
                                    >
                                      <Capacity
                                        maxActivities={
                                          partner.maxNumberOfActivities
                                        }
                                        currentActivities={
                                          partner.currentNumberOfActivities
                                        }
                                      />

                                      <Typography variant="caption">
                                        W:
                                        <strong>{` ${duration.days()} ${
                                          duration.days() === 1 ? 'day' : 'days'
                                        }, ${duration.hours()} ${
                                          duration.hours() === 1
                                            ? 'hour'
                                            : 'hours'
                                        }`}</strong>
                                      </Typography>
                                    </Grid>
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                        <Divider />
                      </Collapse>

                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography>
                          Expires:{' '}
                          <strong>{` ${getExpiration(invite)}`}</strong>
                        </Typography>
                        <Button
                          className={classes.deleteButton}
                          onClick={() => setSelectedInviteId(invite.id)}
                        >
                          {DELETE}
                        </Button>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className={classes.listContainer}>
          <List classes={{ root: classes.subListContainer }}>
            <ListItem>
              <ListItemText primary={NUMBERS} />
            </ListItem>
            <Divider />
            <ListSubheader>Invite Settings</ListSubheader>
            <ListItem>
              <ListItemText
                primary="Invite expiry interval"
                secondary={`${inviteExpiryInterval?.value} ${
                  inviteExpiryInterval?.unit === 'hours' ? 'hours' : 'seconds'
                }`}
              />
            </ListItem>
            <ListSubheader>Invite Statistics</ListSubheader>
          </List>
        </div>
      </Grid>
    </Grid>
  );
};

export default withNavbar(InvitesPage);
