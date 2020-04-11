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
  })
);

interface IPartnerInQueue {
  id: number;
  displayName: string;
  currentNumberOfActivities: number;
  maxNumberOfActivities: number;
  lastChatFinished: string;
}

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

type invitesState = {
  content: Array<IPartnerInQueue>;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageSize: number;
    pageNumber: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElement: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  empty: boolean;
};

type invitesAction = {
  type: 'SET_QUEUE';
  payload: invitesState;
};

const invitesReducerInitialState: invitesState = {
  content: [],
  pageable: {
    sort: {
      sorted: false,
      unsorted: false,
      empty: false,
    },
    pageSize: 0,
    pageNumber: 0,
    offset: 0,
    paged: false,
    unpaged: false,
  },
  last: false,
  totalPages: 0,
  totalElement: 0,
  sort: {
    sorted: false,
    unsorted: false,
    empty: false,
  },
  first: false,
  number: 0,
  numberOfElements: 0,
  size: 0,
  empty: false,
};

const invitesReducer = (state: invitesState, action: invitesAction) => {
  switch (action.type) {
    case 'SET_QUEUE':
      return { ...state, ...action.payload };
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
    dispatch({ type: 'SET_QUEUE', payload: partnerQueue[0] as invitesState });
    setIsFetchingQueue(false);
  }, []);

  const fetchInviteStats = useCallback(async () => {
    setIsFetchingStats(true);
    await wait();
    setIsFetchingStats(false);
  }, []);

  const fetchInvites = useCallback(async () => {
    setIsFetchingInvites(true);
    await wait();
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

  const inviteArray = [
    { title: 'Invite 1' },
    { title: 'Invite 2' },
    { title: 'Invite 3' },
    { title: 'Invite 4' },
    { title: 'Invite 5' },
    { title: 'Invite 6' },
  ];

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
                {state.content.map((partner) => {
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
          <Grid classes={{ root: classes.invitesContainer }} container spacing={2} justify="space-evenly">
            {inviteArray.map((invite) => (
              <Grid key={uuid()} item xs={6} md={4} lg={3}>
                <Card>
                  <CardContent>
                    <Typography>{invite.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
