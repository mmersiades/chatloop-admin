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
import CumulativeActivitiesChart from './CumulativeActivitiesChart';
import MessagesChart from './MessagesChart';
import ActivitiesInProgressChart from './ActivitiesInProgressChart';
import TotalActiveReferralsChart from './TotalActiveReferralsChart';
import TotalCumulativeReferralsChart from './TotalCumulativeReferralsChart';

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

  return (
    <>
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
          <ActivitiesInProgressChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <CumulativeActivitiesChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <MessagesChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <TotalActiveReferralsChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <TotalCumulativeReferralsChart />
        </CardContent>
      </Card>
    </>
  );
};

export default WithNavbar(DashboardPage);
