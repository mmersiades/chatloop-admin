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
import { CircularProgress, Grid } from '@material-ui/core';
import { RangeKeyDict } from 'react-date-range';
import { Bar } from 'react-chartjs-2';

import { useStats } from '../../contexts/statsContext';
import ChartWrapper from './ChartWrapper';
import { ACTIVITIES_IN_PROGRESS_TITLE } from '../../config/textConstants';

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

const AipChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- Hooks -------------------------------------- //
  const { getAipStats, aipStats, aipEndDate, aipStartDate, fetchingAip } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getAipStats) {
      const success = await getAipStats({
        startDate,
        endDate,
      });

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

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={ACTIVITIES_IN_PROGRESS_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={aipStartDate}
      endDate={aipEndDate}
      anchorEl={pickerAnchor}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingAip || !aipStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Bar data={aipStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default AipChart;
