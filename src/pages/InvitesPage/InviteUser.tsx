import React, { FC } from 'react';
import { Typography } from '@material-ui/core';

import { useInviteStyles } from '.';

interface InviteUser {
  designation: 'L' | 'P';
  id: number;
  displayName: string;
}

// eslint-disable-next-line
const InviteUser: FC<InviteUser> = ({ designation, id, displayName }) => {
  const classes = useInviteStyles();
  return (
    <Typography variant="body1" color="primary">
      <span className={classes.partnerId}>{`[${designation}-${id}] `}</span>
      <strong>{displayName}</strong>
    </Typography>
  );
};

export default InviteUser;
