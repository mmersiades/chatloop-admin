import { FC, useState } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useStats } from '../../contexts/statsContext';
import { RangeKeyDict } from 'react-date-range';
import { CircularProgress, Grid } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import ChartWrapper from './ChartWrapper';
import { MAU_TITLE } from '../../config/textConstants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

interface Props {}

const MauChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const { getMauStats, mauStats, mauEndDate, mauStartDate, fetchingMau } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getMauStats) {
      const success = await getMauStats({ startDate, endDate });

      success && setPickerAnchor(null);
    }
  };

  const togglePicker = (event: any) => {
    if (pickerAnchor !== null) {
      setPickerAnchor(null);
    } else {
      setPickerAnchor(event.currentTarget);
    }
  };

  const minDate = new Date('2022-04-24');
  const maxDate = new Date();

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={MAU_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={mauStartDate}
      endDate={mauEndDate}
      anchorEl={pickerAnchor}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingMau || !mauStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Bar data={mauStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default MauChart;
