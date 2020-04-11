import React, { FC, useEffect, useState, useReducer, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
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
} from '@material-ui/core';
import invitesContext from '../../contexts/invitesContext';
import clsx from 'clsx';
import appPropertiesContext from '../../contexts/appPropertiesContext';
import { IPartnerInQueue, IPageable, IInvite } from '../../@types/interfaces';

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
  })
);

interface IRefreshButtonProps {
  isRefreshing: boolean;
  handleClick: () => void;
}

interface IPrimaryPartnerListText {
  id: number;
  displayName: string;
}

interface ISecondaryPartnerListTextProps {
  duration: { days: () => number; hours: () => number };
  currentActivities: number;
  maxActivities: number;
}

interface IInviteUser {
  designation: 'L' | 'P';
  id: number;
  displayName: string;
}

interface ICapacity {
  maxActivities: number;
  currentActivities: number;
}

type invitesState = {
  partnersQueue?: IPageable<Array<IPartnerInQueue>>;
  invites?: IPageable<Array<IInvite>>;
};

type invitesAction =
  | {
      type: 'SET_QUEUE';
      payload: IPageable<Array<IPartnerInQueue>>;
    }
  | { type: 'SET_INVITES'; payload: IPageable<Array<IInvite>> };

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
  const [isFetchingQueue, setIsFetchingQueue] = useState<boolean>(true);
  const [isFetchingStats, setIsFetchingStats] = useState<boolean>(true);
  const [isFetchingInvites, setIsFetchingInvites] = useState<boolean>(true);
  const [state, dispatch] = useReducer(invitesReducer, invitesReducerInitialState);

  const classes = useStyles();

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
    const partnerQueue = await Promise.all([invitesService.getPartnerQueue(), wait()]);
    dispatch({ type: 'SET_QUEUE', payload: partnerQueue[0] as IPageable<Array<IPartnerInQueue>> });
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
    dispatch({ type: 'SET_INVITES', payload: invites[0] as IPageable<Array<IInvite>> });
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

  const RefreshButton: FC<IRefreshButtonProps> = ({ handleClick, isRefreshing }) => (
    <Button variant="text" color="secondary" onClick={() => handleClick()}>
      {isRefreshing ? <CircularProgress classes={{ root: classes.spinner }} size="1rem" thickness={2.4} /> : 'REFRESH'}
    </Button>
  );

  const PrimaryPartnerListText: FC<IPrimaryPartnerListText> = ({ id, displayName }) => (
    <Typography variant="body1" color="primary">
      <span className={classes.partnerId}>{`[${id}] `}</span>
      <strong>{displayName}</strong>
    </Typography>
  );

  const SecondaryPartnerListText: FC<ISecondaryPartnerListTextProps> = ({
    duration,
    currentActivities,
    maxActivities,
  }) => (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="caption">{`Waiting: ${duration.days()} ${
          duration.days() === 1 ? 'day' : 'days'
        } and ${duration.hours()} ${duration.hours() === 1 ? 'hour' : 'hours'}`}</Typography>
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

  const InviteUser: FC<IInviteUser> = ({ designation, id, displayName }) => (
    <Typography variant="body1" color="primary">
      <span className={classes.partnerId}>{`[${designation}-${id}] `}</span>
      <strong>{displayName}</strong>
    </Typography>
  );

  const Capacity: FC<ICapacity> = ({ maxActivities, currentActivities }) => (
    <Typography variant="caption">
      Capacity:
      <strong>{` ${maxActivities - currentActivities}`}</strong>
    </Typography>
  );

  return (
    <invitesContext.Provider value={state}>
      <Grid container>
        <Grid item xs={3} lg={2}>
          <div className={classes.listContainer}>
            <List classes={{ root: classes.subListContainer }}>
              <ListItem>
                <ListItemText primary="Partner Queue" />
                <ListItemSecondaryAction>
                  <RefreshButton handleClick={fetchQueue} isRefreshing={isFetchingQueue} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <div className={classes.queue}>
                {state.partnersQueue?.content.map((partner: IPartnerInQueue) => {
                  const duration = moment.duration(moment().diff(moment(partner.lastChatFinished)));
                  return (
                    <ListItem key={uuid()}>
                      <ListItemText
                        disableTypography
                        primary={<PrimaryPartnerListText id={partner.id} displayName={partner.displayName} />}
                        secondary={
                          <SecondaryPartnerListText
                            duration={duration}
                            currentActivities={partner.currentNumberOfActivities}
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
          <List classes={{ root: clsx(classes.subListContainer, classes.invitesHeader) }}>
            <ListItem>
              <ListItemText primary="Invites" />
              <ListItemSecondaryAction>
                <RefreshButton handleClick={fetchInvites} isRefreshing={isFetchingInvites} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </List>
          <div className={classes.queue}>
            <Grid classes={{ root: classes.invitesContainer }} container spacing={2} justify="space-evenly">
              {state.invites?.content.length === 0 ? (
                <p>No invites</p>
              ) : (
                state.invites?.content.map((invite: IInvite) => (
                  <Grid key={uuid()} item xs={6} md={6} lg={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="body1" color="primary">
                          <span className={classes.partnerId}>{`[${invite.id}] `}</span>
                          <strong>{invite.topic}</strong>
                        </Typography>
                        <Divider />
                        <List dense disablePadding>
                          <ListItem key={uuid()} classes={{ root: classes.noPadding }}>
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
                                  maxActivities={invite.learner.maxNumberOfActivities}
                                  currentActivities={invite.learner.currentNumberOfActivities}
                                />
                              }
                            />
                          </ListItem>
                          {invite.partners.map((partner: IPartnerInQueue) => {
                            const duration = moment.duration(moment().diff(moment(partner.lastChatFinished)));
                            return (
                              <ListItem key={uuid()} classes={{ root: classes.noPadding }}>
                                <ListItemText
                                  disableTypography
                                  primary={
                                    <InviteUser designation="P" id={partner.id} displayName={partner.displayName} />
                                  }
                                  secondary={
                                    <Grid container justify="space-between">
                                      <Capacity
                                        maxActivities={partner.maxNumberOfActivities}
                                        currentActivities={partner.currentNumberOfActivities}
                                      />

                                      <Typography variant="caption">
                                        W:
                                        <strong>{` ${duration.days()} ${
                                          duration.days() === 1 ? 'day' : 'days'
                                        }, ${duration.hours()} ${duration.hours() === 1 ? 'hour' : 'hours'}`}</strong>
                                      </Typography>
                                    </Grid>
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                        <Divider />
                        <Typography>
                          Expires: <strong>{moment(invite.sentOn).toNow()}</strong>
                        </Typography>
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
                <ListItemText primary="Numbers" />
                <ListItemSecondaryAction>
                  <RefreshButton handleClick={fetchInviteStats} isRefreshing={isFetchingStats} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListSubheader>Invite Settings</ListSubheader>
              <appPropertiesContext.Consumer>
                {(value) => (
                  <ListItem>
                    <ListItemText
                      primary="Invite expiry interval"
                      secondary={`${value.inviteExpiryInterval?.value} ${
                        value.inviteExpiryInterval?.unit === 'HOUR' ? 'hours' : 'seconds'
                      }`}
                    />
                  </ListItem>
                )}
              </appPropertiesContext.Consumer>
              <ListSubheader>Invite Statistics</ListSubheader>
            </List>
          </div>
        </Grid>
      </Grid>
    </invitesContext.Provider>
  );
};

export default withNavbar(InvitesPage);
