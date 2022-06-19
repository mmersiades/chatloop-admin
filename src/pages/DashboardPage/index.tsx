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
import { useStats } from '../../contexts/statsContext';
import {
  ACTIVITY_CAPACITY_TITLE,
  CURRENT_ACTIVITIES_LABEL,
  CURRENT_LEARNERS_LABEL,
  LEARNER_CAPACITY_TITLE,
  MAX_ACTIVITIES_LABEL,
  MAX_LEARNERS_LABEL,
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
              maxLabel={MAX_LEARNERS_LABEL}
              maxValue={capacities.tutorMaxLearnerCapacity}
              currentLabel={CURRENT_LEARNERS_LABEL}
              currentValue={capacities.learnerCount}
            />
          </CardContent>
        </Card>
      )}
      {capacities && (
        <Card classes={{ root: classes.card }}>
          <CardContent>
            <CapacityCard
              title={ACTIVITY_CAPACITY_TITLE}
              maxLabel={MAX_ACTIVITIES_LABEL}
              maxValue={capacities.partnerMaxActivityCapacity}
              currentLabel={CURRENT_ACTIVITIES_LABEL}
              currentValue={capacities.activityCount}
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
