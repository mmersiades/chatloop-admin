import { FC } from 'react';
import { Grid, Typography } from '@material-ui/core';

import { ACTUAL_CAPACITY_LABEL } from '../../config/textConstants';

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
  label1: string;
  value1: string;
  label2: string;
  value2: string;
  label3: string;
  value3: string;
  showDanger1?: boolean;
  showDanger2?: boolean;
  showDanger3?: boolean;
}

const CapacityCard: FC<Props> = ({
  title,
  label1,
  value1,
  label2,
  value2,
  label3,
  value3,
  showDanger1 = false,
  showDanger2 = false,
  showDanger3 = false,
}) => {
  // -------------------------- Render ------------------------------------- //
  const toDecimal = (percent: string) => {
    const parsed = parseFloat(percent);

    if (!Number.isNaN(parsed)) {
      return parseFloat(percent) / 100;
    } else {
      return 0;
    }
  };

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
            <NumberDisplay
              label={label1}
              value={value1}
              danger={showDanger1 ? toDecimal(value1) > 0.8 : false}
            />
          </Grid>
          <Grid item xs={4}>
            <NumberDisplay
              label={label2}
              value={value2}
              danger={showDanger2 ? toDecimal(value2) > 0.8 : false}
            />
          </Grid>
          <Grid item xs={4}>
            <NumberDisplay
              label={label3}
              value={value3}
              danger={showDanger3 ? toDecimal(value3) > 0.8 : false}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default CapacityCard;
