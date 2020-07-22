import React, { useReducer, useEffect, FC } from 'react';
import WithNavbar from '../../components/WithNavbar';
import { UsersContext } from '../../contexts/usersContext';
import usersService from '../../services/usersService';
import { Learner, Partner, Tutor } from '../../@types/interfaces';
import { Tabs, Tab, Theme, makeStyles, createStyles } from '@material-ui/core';
import { UserRoles } from '../../@types/enums';
import Learners from './Learners';
import Partners from './Partners';
import Tutors from './Tutors';
import { useAppNav } from '../../contexts/appNavContext';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    usersContainer: {
      height: '100%',
      width: '100%',
    },
    tabs: {
      width: '100%',
      backgroundColor: palette.common.white,
    },
  })
);

type usersState = {
  learners?: Array<Learner>;
  partners?: Array<Partner>;
  tutors?: Array<Tutor>;
};

export type usersAction =
  | {
      type: 'SET_LEARNERS';
      payload?: Array<Learner>;
    }
  | {
      type: 'SET_PARTNERS';
      payload?: Array<Partner>;
    }
  | {
      type: 'SET_TUTORS';
      payload?: Array<Tutor>;
    };

interface FormikValues {
  email: string;
  displayName: string;
  shift: string;
}

/** An object of params passed to `tableGenerator` based on the role of Users the table is for */
interface RoleParams {
  userRole: UserRoles;
  role: string;
  getUser: any;
  action: 'SET_LEARNERS' | 'SET_PARTNERS' | 'SET_TUTORS' | '';
  count: number;
  rows: Array<any>;
}

const usersReducerInitialState: usersState = {
  learners: [],
  partners: [],
  tutors: [],
};

const usersReducer = (state: usersState, action: usersAction) => {
  switch (action.type) {
    case 'SET_LEARNERS':
      return { ...state, learners: action.payload };
    case 'SET_PARTNERS':
      return { ...state, partners: action.payload };
    case 'SET_TUTORS':
      return { ...state, tutors: action.payload };
    default:
      return state;
  }
};

const UsersPage: FC = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(usersReducer, usersReducerInitialState);
  const [tab, setTab] = React.useState(0);
  const { setShowUserDrawer } = useAppNav();

  const fetchTutors = async () => {
    await usersService.getTutors(dispatch);
  };

  const fetchPartners = async () => {
    await usersService.getPartners(dispatch);
  };

  const fetchLearners = async () => {
    await usersService.getLearners(dispatch);
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <UsersContext.Provider value={{ ...state, fetchLearners, fetchPartners, fetchTutors, usersDispatch: dispatch }}>
      <div className={classes.usersContainer}>
        <div className={classes.tabs}>
          <Tabs
            value={tab}
            onChange={(event, newValue) => {
              setTab(newValue);
              setShowUserDrawer(false);
            }}
            indicatorColor="primary"
            textColor="primary"
            centered
            TabIndicatorProps={{
              style: { backgroundColor: '#45ecff', height: '8px' },
            }}
          >
            <Tab label="Learners" />
            <Tab label="Partners" />
            <Tab label="Tutors" />
          </Tabs>
        </div>

        {tab === 0 && <Learners />}
        {tab === 1 && <Partners />}
        {tab === 2 && <Tutors />}
      </div>
    </UsersContext.Provider>
  );
};

export default WithNavbar(UsersPage);
