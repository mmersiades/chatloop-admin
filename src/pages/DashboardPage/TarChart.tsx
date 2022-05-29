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
import { RangeKeyDict } from 'react-date-range';
import { Bar } from 'react-chartjs-2';
import { CircularProgress, Grid } from '@material-ui/core';

import ChartWrapper from '../../components/base/ChartWrapper';
import { options } from './DauChart';
import { useStats } from '../../contexts/statsContext';
import { TAR_TITLE } from '../../config/textConstants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Use something like this when setting up dark mode
// https://www.chartjs.org/docs/latest/configuration/
// const options: ChartOptions<'bar'> = {
//   responsive: true,
//   plugins: {
//     legend: {
//       labels: {
//         color: '#fff',
//       },
//     },
//   },
//   scales: {
//     x: {
//       stacked: true,
//     },
//     y: {
//       stacked: true,
//     },
//     yAxes: {
//       grid: {
//         drawBorder: true,
//         color: '#FFFFFF',
//       },
//     },
//     xAxes: {
//       grid: {
//         drawBorder: true,
//         color: '#FFFFFF',
//       },
//     },
//   },
// };

interface Props {}

const TarChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- Hooks -------------------------------------- //
  const { getTarStats, tarStats, tarEndDate, tarStartDate, fetchingTar } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getTarStats) {
      const success = await getTarStats({ startDate, endDate });

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

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={TAR_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={tarStartDate}
      endDate={tarEndDate}
      anchorEl={pickerAnchor}
    >
      <>
        {fetchingTar || !tarStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Bar data={tarStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default TarChart;
