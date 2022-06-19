import { FC } from 'react';
import { Grid, Typography } from '@material-ui/core';

import { CAPACITY_LABEL } from '../../config/textConstants';

interface NumberDisplayProps {
  label: string;
  value: string;
  danger?: boolean;
}

const NumberDisplay: FC<NumberDisplayProps> = ({
  label,
  value,
  danger = false,
}) => (
  <Grid container direction={'column'} alignItems={'center'}>
    <Typography
      variant={'h2'}
      color={danger ? 'error' : 'secondary'}
      align={'center'}
    >
      {value}
    </Typography>
    <Typography variant={'h6'} align={'center'}>
      {label}
    </Typography>
  </Grid>
);

interface Props {
  title: string;
  maxLabel: string;
  maxValue: number;
  currentLabel: string;
  currentValue: number;
}

const CapacityCard: FC<Props> = ({
  title,
  maxLabel,
  maxValue,
  currentLabel,
  currentValue,
}) => {
  // -------------------------- Render ------------------------------------- //
  const percent = Math.floor((currentValue / maxValue) * 100);
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" component="span">
          {title}
        </Typography>
        <Grid
          container
          direction={'row'}
          style={{ height: '175px' }}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={4}>
            <NumberDisplay label={maxLabel} value={maxValue.toString()} />
          </Grid>
          <Grid item xs={4}>
            <NumberDisplay
              label={currentLabel}
              value={currentValue.toString()}
            />
          </Grid>
          <Grid item xs={4}>
            <NumberDisplay
              label={CAPACITY_LABEL}
              value={`${percent}%`}
              danger={percent > 80}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default CapacityCard;
