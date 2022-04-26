import React, { FC, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import WithNavbar from '../../components/WithNavbar';
import statsService from '../../services/statsService';
import DauChart from './DauChart';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    card: {
      margin: spacing(2),
      width: 600,
    },
  })
);

const DashboardPage: FC = () => {
  const classes = useStyles();
  const [activeUsersToday, setActiveUsersToday] = useState(0);
  const [activeUsersMonthToDate, setActiveUsersMonthToDate] = useState(0);

  const setStats = async () => {
    const { data } = await statsService.getUsageStats();

    setActiveUsersMonthToDate(data.activeUsersMonthToDate);
    setActiveUsersToday(data.activeUsersToday);
  };

  useEffect(() => {
    setStats();
  }, []);

  return (
    <>
      <Card classes={{ root: classes.card }}>
        <CardHeader title="Users active today" />
        <CardContent>
          <Typography variant="h3" align="center">
            {activeUsersToday}
          </Typography>
        </CardContent>
      </Card>

      <Card classes={{ root: classes.card }}>
        <CardContent>
          <DauChart />
        </CardContent>
      </Card>
      <Card classes={{ root: classes.card }}>
        <CardHeader title="Users active last 30 days" />
        <CardContent>
          <Typography variant="h3" align="center">
            {activeUsersMonthToDate}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default WithNavbar(DashboardPage);
