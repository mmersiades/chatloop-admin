import { FC, useState } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartDataset,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { RangeKeyDict } from 'react-date-range';
import { Chart } from 'react-chartjs-2';
import { CircularProgress, Grid } from '@material-ui/core';

import ChartWrapper from './ChartWrapper';
import { useStats } from '../../contexts/statsContext';
import { LEARNER_CAPACITY_STATS_TITLE } from '../../config/textConstants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
};

interface Props {}

const LearnerCapacityChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- Hooks -------------------------------------- //
  const {
    getLearnerCapacityStats,
    learnerCapacityStats,
    learnerCapacityEndDate,
    learnerCapacityStartDate,
    fetchingLearnerCapacityStats,
  } = useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getLearnerCapacityStats) {
      const success = await getLearnerCapacityStats({ startDate, endDate });

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

  const minDate = new Date('2022-09-26');
  const maxDate = new Date();

  // -------------------------- Render ------------------------------------- //
  const datasets: ChartDataset[] =
    learnerCapacityStats?.datasets.map((ds) => {
      const dataSet: ChartDataset = { ...ds };
      if (ds.label === 'Max Supply') {
        dataSet.type = 'line';
        dataSet.borderColor = ds.backgroundColor;
      } else {
        dataSet.type = 'bar';
      }
      return dataSet;
    }) ?? [];
  return (
    <ChartWrapper
      title={LEARNER_CAPACITY_STATS_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={learnerCapacityStartDate}
      endDate={learnerCapacityEndDate}
      anchorEl={pickerAnchor}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingLearnerCapacityStats || !learnerCapacityStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 372 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Chart
            type={'bar'}
            data={{ labels: learnerCapacityStats.labels, datasets }}
            options={options}
          />
        )}
      </>
    </ChartWrapper>
  );
};

export default LearnerCapacityChart;
