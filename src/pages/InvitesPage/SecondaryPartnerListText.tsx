import React, { FC } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { PartnerInQueue } from '../../@types/interfaces';
import moment from 'moment';

interface SecondaryPartnerListTextProps {
  partner: PartnerInQueue;
  // lastActivityDuration: { days: () => number; hours: () => number };
}

const SecondaryPartnerListText: FC<SecondaryPartnerListTextProps> = ({
  partner,
}) => {
  const getLastActivity = (): string => {
    if (!partner.lastActivityFinished) {
      return 'Last activity: no activities yet';
    }

    const time = moment(partner.lastActivityFinished);

    return `Last activity: ${time.format('MMM D HH')}:00`;
  };

  const getQueueTime = (): string => {
    if (!partner.lastInviteMissed) {
      return 'Queue time: No invites missed';
    }

    const time = moment(partner.lastInviteMissed);

    return `Queue time: ${time.format('MMM D HH')}:00`;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="caption">{getLastActivity()}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="caption">{getQueueTime()}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption">
          Current activities:{' '}
          <strong>{partner.currentNumberOfActivities}</strong>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption">
          Max activities: <strong>{partner.maxNumberOfActivities}</strong>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SecondaryPartnerListText;
