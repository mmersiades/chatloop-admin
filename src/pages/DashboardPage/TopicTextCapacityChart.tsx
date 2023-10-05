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
import {
  LEARNER_CAPACITY_STATS_TITLE,
  TOPICTEXT_CAPACITY_STATS_TITLE,
} from '../../config/textConstants';

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

const TopicTextCapacityChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- Hooks -------------------------------------- //
  const {
    getTopicTextCapacityStats,
    topicTextCapacityStats,
    topicTextCapacityEndDate,
    topicTextCapacityStartDate,
    fetchingTopicTextCapacityStats,
  } = useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getTopicTextCapacityStats) {
      const success = await getTopicTextCapacityStats({ startDate, endDate });

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
    topicTextCapacityStats?.datasets.map((ds) => {
      const dataSet: ChartDataset = { ...ds };
      if (ds.label === 'Max Supply' || ds.label === 'Potential Demand') {
        dataSet.type = 'line';
        dataSet.borderColor = ds.backgroundColor;
      } else {
        dataSet.type = 'bar';
        dataSet.stack = 'actual';
      }

      return dataSet;
    }) ?? [];
  return (
    <ChartWrapper
      title={TOPICTEXT_CAPACITY_STATS_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={topicTextCapacityStartDate}
      endDate={topicTextCapacityEndDate}
      anchorEl={pickerAnchor}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingTopicTextCapacityStats || !topicTextCapacityStats ? (
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
            data={{ labels: topicTextCapacityStats.labels, datasets }}
            options={options}
          />
        )}
      </>
    </ChartWrapper>
  );
};

export default TopicTextCapacityChart;
