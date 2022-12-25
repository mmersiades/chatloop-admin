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
      return 'No activities yet';
    }
    console.log('partner.lastActivityFinished', partner.lastActivityFinished);
    const lastActivityDuration = moment.duration(
      moment().diff(moment(partner.lastActivityFinished))
    );
    return `Last activity: ${lastActivityDuration.days()} ${
      lastActivityDuration.days() === 1 ? 'day' : 'days'
    } and ${lastActivityDuration.hours()} ${
      lastActivityDuration.hours() === 1 ? 'hour' : 'hours'
    } ago`;
  };

  const getQueueTime = (): string => {
    // if (!partner.lastInviteMissed) {
    //   return 'Queue time: No invites missed';
    // }
    const time = moment(partner.lastActivityFinished);

    return `Queue time: ${time.format('MMM D HH')}:00`;
  };

  console.log('partner.lastInviteMissed', partner.lastInviteMissed);
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
