import React, { FC } from 'react';
import { Grid, Typography } from '@material-ui/core';

interface SecondaryPartnerListTextProps {
  duration: { days: () => number; hours: () => number };
  currentActivities: number;
  maxActivities: number;
}

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

export default SecondaryPartnerListText;
