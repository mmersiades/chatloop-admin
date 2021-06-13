import React, { FC, useEffect, useState, useReducer, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import withNavbar from '../../components/WithNavbar';
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
  Dialog,
  DialogContent,
  DialogActions,
  Collapse,
  IconButton,
} from '@material-ui/core';
import clsx from 'clsx';
import { PartnerInQueue, Pageable, Invite } from '../../@types/interfaces';
import { AxiosResponse } from 'axios';
import { ExpandMoreRounded, ExpandLessRounded } from '@material-ui/icons';
import { useAppProperties } from '../../contexts/appPropertiesContext';
import { InvitesContext } from '../../contexts/invitesContext';
import { NO_INVITES, NUMBERS, PARTNER_QUEUE } from '../../config/textConstants';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
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

interface PrimaryPartnerListText {
  id: number;
  displayName: string;
}

interface SecondaryPartnerListTextProps {
  duration: { days: () => number; hours: () => number };
  currentActivities: number;
  maxActivities: number;
}

interface InviteUser {
  designation: 'L' | 'P';
  id: number;
  displayName: string;
}

interface Capacity {
  maxActivities: number;
  currentActivities: number;
}

type invitesState = {
  partnersQueue?: Pageable<Array<PartnerInQueue>>;
  invites?: Pageable<Array<Invite>>;
};

type invitesAction =
  | {
      type: 'SET_QUEUE';
      payload: Pageable<Array<PartnerInQueue>>;
    }
  | { type: 'SET_INVITES'; payload: Pageable<Array<Invite>> };

const invitesReducerInitialState: invitesState = {};

const invitesReducer = (state: invitesState, action: invitesAction) => {
  switch (action.type) {
    case 'SET_QUEUE':
      return { ...state, partnersQueue: action.payload };
    case 'SET_INVITES':
      return { ...state, invites: action.payload };
    default:
      return state;
  }
};

const InvitesPage: FC = () => {
  const [showConfirmInviteDelete, setShowConfirmInviteDelete] = useState<{
    show: boolean;
    id: number | null;
  }>({
    show: false,
    id: null,
  });
  const [expandedInvite, setexpandedInvite] = useState<number | null>();
  const [isFetchingQueue, setIsFetchingQueue] = useState<boolean>(true);
  const [isFetchingStats, setIsFetchingStats] = useState<boolean>(true);
  const [isFetchingInvites, setIsFetchingInvites] = useState<boolean>(true);
  const [state, dispatch] = useReducer(
    invitesReducer,
    invitesReducerInitialState
  );

  const classes = useStyles();

  const { inviteExpiryInterval } = useAppProperties();

  const getExpiration = (invite: Invite) =>
    momentTZ
      .utc(invite.sentOn)
      .tz(momentTZ.tz.guess())
      .add(inviteExpiryInterval?.value, inviteExpiryInterval?.unit)
      .format('ddd, h:mm:ss a');

  /**
   * Adds a 1s delay in fetching so Users can see the refresh,
   * even on really fast networks
   */
  const wait = async () =>
    new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

  const fetchQueue = useCallback(async () => {
    setIsFetchingQueue(true);
    const partnerQueue = await Promise.all([
      invitesService.getPartnerQueue(),
      wait(),
    ]);
    dispatch({
      type: 'SET_QUEUE',
      payload: partnerQueue[0] as Pageable<Array<PartnerInQueue>>,
    });
    setIsFetchingQueue(false);
  }, []);

  const fetchInviteStats = useCallback(async () => {
    setIsFetchingStats(true);
    await wait();
    setIsFetchingStats(false);
  }, []);

  const fetchInvites = useCallback(async () => {
    setIsFetchingInvites(true);
    const invites = await Promise.all([invitesService.getInvites(), wait()]);
    dispatch({
      type: 'SET_INVITES',
      payload: invites[0] as Pageable<Array<Invite>>,
    });
    setIsFetchingInvites(false);
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    fetchInviteStats();
  }, [fetchInviteStats]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  useEffect(() => {
    let interval: number | undefined;
    if (!!inviteExpiryInterval) {
      interval = window.setInterval(() => {
        console.log('polled');
        fetchQueue();
        fetchInviteStats();
        fetchInvites();
      }, inviteExpiryInterval.ms / 2);
    }
    return () => window.clearInterval(interval);
  }, [inviteExpiryInterval, fetchQueue, fetchInviteStats, fetchInvites]);

  const handleDeleteInvite = async (id: number) => {
    const response: AxiosResponse | undefined =
      await invitesService.deleteInvite(id);
    console.log(`response`, response);
    if (response) {
      console.log(`response.status === 200`, response.status === 200);
      console.log(
        `response.data === 'Invite-Deleted'`,
        response.data === 'Invite-Deleted'
      );
      if (response.status === 200 && response.data === 'Invite-Deleted') {
        fetchQueue();
        fetchInvites();
        fetchInviteStats();
        alert(response.data);
      } else {
        alert(`failed to delete invite ${id}`);
      }
    }
    setShowConfirmInviteDelete({ show: false, id: null });
  };

  const PrimaryPartnerListText: FC<PrimaryPartnerListText> = ({
    id,
    displayName,
  }) => (
    <Typography variant="body1" color="primary">
      <span className={classes.partnerId}>{`[${id}] `}</span>
      <strong>{displayName}</strong>
    </Typography>
  );

  const SecondaryPartnerListText: FC<SecondaryPartnerListTextProps> = ({
    duration,
    currentActivities,
    maxActivities,
  }) => (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="caption">{`Waiting: ${duration.days()} ${
          duration.days() === 1 ? 'day' : 'days'
        } and ${duration.hours()} ${
          duration.hours() === 1 ? 'hour' : 'hours'
        }`}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption">
          Current activities: <strong>{currentActivities}</strong>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption">
          Max activities: <strong>{maxActivities}</strong>
        </Typography>
      </Grid>
    </Grid>
  );

  const InviteUser: FC<InviteUser> = ({ designation, id, displayName }) => (
    <Typography variant="body1" color="primary">
      <span className={classes.partnerId}>{`[${designation}-${id}] `}</span>
      <strong>{displayName}</strong>
    </Typography>
  );

  const Capacity: FC<Capacity> = ({ maxActivities, currentActivities }) => (
    <Typography variant="caption">
      Capacity:
      <strong>{` ${maxActivities - currentActivities}`}</strong>
    </Typography>
  );

  const ConfirmInviteDeleteDialog: FC = () => (
    <Dialog
      open={showConfirmInviteDelete.show}
      onClose={() => setShowConfirmInviteDelete({ show: false, id: null })}
    >
      <DialogContent>
        <Typography>{`Are you sure you want to delete invite ${showConfirmInviteDelete.id}?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowConfirmInviteDelete({ show: false, id: null })}
        >
          CANCEL
        </Button>
        <Button
          className={classes.deleteButton}
          aria-label="confirm-delete-button"
          variant="outlined"
          onClick={() =>
            showConfirmInviteDelete.id &&
            handleDeleteInvite(showConfirmInviteDelete.id)
          }
        >
          DELETE
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <InvitesContext.Provider value={state}>
      <Grid container>
        <ConfirmInviteDeleteDialog />
        <Grid item xs={3} lg={2}>
          <div className={classes.listContainer}>
            <List classes={{ root: classes.subListContainer }}>
              <ListItem>
                <ListItemText primary={PARTNER_QUEUE} />
                <ListItemSecondaryAction>
                  {isFetchingQueue && (
                    <CircularProgress size="1rem" thickness={2.4} />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <div className={classes.queue}>
                {state.partnersQueue?.content.map((partner: PartnerInQueue) => {
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
              </div>
            </List>
          </div>
        </Grid>
        <Grid item xs={6} lg={8}>
          <List
            classes={{
              root: clsx(classes.subListContainer, classes.invitesHeader),
            }}
          >
            <ListItem>
              <ListItemText primary="Invites" />
              <ListItemSecondaryAction>
                {isFetchingInvites && (
                  <CircularProgress size="1rem" thickness={2.4} />
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
              justify="space-evenly"
            >
              {state.invites?.content.length === 0 ? (
                <p>{NO_INVITES}</p>
              ) : (
                state.invites?.content.map((invite: Invite) => (
                  <Grid key={uuid()} item xs={12} md={12} lg={6}>
                    <Card>
                      <CardContent>
                        <Grid
                          container
                          justify="space-between"
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
                              onClick={() => setexpandedInvite(null)}
                              aria-label="show more"
                            >
                              <ExpandLessRounded />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => setexpandedInvite(invite.id)}
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
                                      <Grid container justify="space-between">
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
                                            duration.days() === 1
                                              ? 'day'
                                              : 'days'
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
                          justify="space-between"
                          alignItems="center"
                        >
                          <Typography>
                            Expires:{' '}
                            <strong>{` ${getExpiration(invite)}`}</strong>
                          </Typography>
                          <Button
                            className={classes.deleteButton}
                            onClick={() =>
                              setShowConfirmInviteDelete({
                                show: true,
                                id: invite.id,
                              })
                            }
                          >
                            DELETE
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
        <Grid item xs={3} lg={2}>
          <div className={classes.listContainer}>
            <List classes={{ root: classes.subListContainer }}>
              <ListItem>
                <ListItemText primary={NUMBERS} />
                <ListItemSecondaryAction>
                  {isFetchingStats && (
                    <CircularProgress size="1rem" thickness={2.4} />
                  )}
                </ListItemSecondaryAction>
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
    </InvitesContext.Provider>
  );
};

export default withNavbar(InvitesPage);
