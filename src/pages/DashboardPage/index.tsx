import React, { FC } from 'react';
import {
  Card,
  CardContent,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';

import WithNavbar from '../../components/WithNavbar';
import DauChart from './DauChart';
import MauChart from './MauChart';
import CaChart from './CaChart';
import MessagesChart from './MessagesChart';
import AipChart from './AipChart';
import TarChart from './TarChart';
import TcrChart from './TcrChart';
import OrChart from './OrChart';
import OoaChart from './OoaChart';
import OarChart from './OarChart';
import OerChart from './OerChart';
import OaiChart from './OaiChart';
import CapacityCard from './CapacityCard';
import LearnerFeedbackChart from './LearnerFeedbackChart';
import { useStats } from '../../contexts/statsContext';
import {
  ACTIVITY_CAPACITY_TITLE,
  ACTUAL_CAPACITY_LABEL,
  CURRENT_LEARNERS_LABEL,
  LEARNER_CAPACITY_TITLE,
  MAX_ACTIVITIES_LABEL,
  MAX_LEARNERS_LABEL,
  POTENTIAL_CAPACITY_LABEL,
} from '../../config/textConstants';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    card: {
      margin: spacing(2),
      width: 600,
    },
    container: {
      minHeight: 'calc(100vh - 48px)',
      display: 'flex',
      flexDirection: 'row',
    },
  })
);

const DashboardPage: FC = () => {
  const classes = useStyles();

  const { capacities } = useStats();

  return (
    <>
      {capacities && (
        <Card classes={{ root: classes.card }}>
          <CardContent>
            <CapacityCard
              title={LEARNER_CAPACITY_TITLE}
              label1={MAX_LEARNERS_LABEL}
              value1={capacities.tutorMaxLearnerCapacity.toString()}
              label2={CURRENT_LEARNERS_LABEL}
              value2={capacities.learnerCount.toString()}
              label3={ACTUAL_CAPACITY_LABEL}
              value3={`${Math.floor(
                (capacities.learnerCount / capacities.tutorMaxLearnerCapacity) *
                  100
              )}%`}
              showDanger3
            />
          </CardContent>
        </Card>
      )}
      {capacities && (
        <Card classes={{ root: classes.card }}>
          <CardContent>
            <CapacityCard
              title={ACTIVITY_CAPACITY_TITLE}
              label1={MAX_ACTIVITIES_LABEL}
              value1={capacities.partnerMaxActivityCapacity.toString()}
              label2={POTENTIAL_CAPACITY_LABEL}
              value2={`${Math.floor(
                (capacities.learnerMaxActivityCapacity /
                  capacities.partnerMaxActivityCapacity) *
                  100
              )}%`}
              showDanger2
              label3={ACTUAL_CAPACITY_LABEL}
              value3={`${Math.floor(
                (capacities.activityCount /
                  capacities.partnerMaxActivityCapacity) *
                  100
              )}%`}
              showDanger3
            />
          </CardContent>
        </Card>
      )}
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <DauChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <MauChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <AipChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <CaChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <MessagesChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <LearnerFeedbackChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <TarChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <TcrChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <OrChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <OoaChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <OarChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <OerChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <OaiChart />
        </CardContent>
      </Card>
    </>
  );
};

export default WithNavbar(DashboardPage);
