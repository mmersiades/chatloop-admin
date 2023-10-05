import { FC, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CircularProgress, Grid } from '@material-ui/core';
import { RangeKeyDict } from 'react-date-range';
import { useStats } from '../../contexts/statsContext';
import ChartWrapper from './ChartWrapper';
import { DAU_TITLE } from '../../config/textConstants';

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

const DauChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- Hooks -------------------------------------- //
  const { getDauStats, dauStats, dauEndDate, dauStartDate, fetchingDau } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getDauStats) {
      const success = await getDauStats({ startDate, endDate });

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
      title={DAU_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={dauStartDate}
      endDate={dauEndDate}
      anchorEl={pickerAnchor}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingDau || !dauStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 372 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Bar data={dauStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default DauChart;
