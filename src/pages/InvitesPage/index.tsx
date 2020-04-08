import React, { FC, useEffect, useState, useReducer } from 'react';
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
} from '@material-ui/core';
import invitesContext from '../../contexts/invitesContext';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    queueContainer: {
      backgroundColor: '#fff',
      height: 'calc(100vh - 50px)',
    },
    list: {
      padding: 'none',
    },
    queue: {
      overflow: 'auto',
      height: 'calc(100vh - 100px)',
    },
    spinner: {
      color: '#fff',
      marginTop: spacing(0.5),
      marginBottom: spacing(0.5),
      marginRight: spacing(2.75),
      marginLeft: spacing(2.75),
    },
  })
);

interface IPartnerInQueue {
  id: number;
  displayName: string;
  currentNumberOfActivites: number;
  maxNumberOfActivities: number;
  lastChatFinished: string;
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
  const [fetchingQueue, setFetchingQueue] = useState<boolean>(true);
  const [state, dispatch] = useReducer(invitesReducer, invitesReducerInitialState);

  const classes = useStyles();

  const fetchQueue = async () => {
    setFetchingQueue(true);
    const partnerQueue = await invitesService.getPartnerQueue();
    dispatch({ type: 'SET_QUEUE', payload: partnerQueue });
    setFetchingQueue(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <invitesContext.Provider value={state}>
      <Grid container>
        <Grid item xs={3}>
          <div className={classes.queueContainer}>
            <List classes={{ root: classes.list }}>
              <ListItem>
                <ListItemText primary="Refresh queue" />
                <ListItemSecondaryAction>
                  <Button variant="contained" color="secondary" onClick={() => fetchQueue()}>
                    {fetchingQueue ? (
                      <CircularProgress classes={{ root: classes.spinner }} size="1rem" thickness={2.4} />
                    ) : (
                      'REFRESH'
                    )}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <div className={classes.queue}>
                {state.content.map((partner) => {
                  const duration = moment.duration(moment().diff(moment(partner.lastChatFinished)));
                  return (
                    <ListItem key={uuid()}>
                      <ListItemText
                        primary={partner.displayName}
                        secondary={`Waiting: ${duration.days()} ${
                          duration.days() === 1 ? 'day' : 'days'
                        } and ${duration.hours()} ${duration.hours() === 1 ? 'hour' : 'hours'}`}
                      />
                    </ListItem>
                  );
                })}
              </div>
            </List>
          </div>
        </Grid>
        <Grid item xs={9}>
          <p>hoo</p>
        </Grid>
      </Grid>
    </invitesContext.Provider>
  );
};

export default withNavbar(InvitesPage);
