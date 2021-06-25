import React, { FC } from 'react';
import { Typography } from '@material-ui/core';

import { useInviteStyles } from '.';

interface PrimaryPartnerListText {
  id: number;
  displayName: string;
}

// eslint-disable-next-line
const PrimaryPartnerListText: FC<PrimaryPartnerListText> = ({
  id,
  displayName,
}) => {
  const classes = useInviteStyles();
  return (
    <Typography variant="body1" color="primary">
      <span className={classes.partnerId}>{`[${id}] `}</span>
      <strong>{displayName}</strong>
    </Typography>
  );
};

export default PrimaryPartnerListText;
