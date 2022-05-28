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
import { TCR_TITLE } from '../../config/textConstants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {}

const TotalCumulativeReferralsChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- Hooks -------------------------------------- //
  const { getTcrStats, tcrStats, tcrEndDate, tcrStartDate, fetchingTcr } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getTcrStats) {
      const success = await getTcrStats({ startDate, endDate });

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
      title={TCR_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={tcrStartDate}
      endDate={tcrEndDate}
      anchorEl={pickerAnchor}
    >
      <>
        {fetchingTcr || !tcrStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Bar data={tcrStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default TotalCumulativeReferralsChart;
