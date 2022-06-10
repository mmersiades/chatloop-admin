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
