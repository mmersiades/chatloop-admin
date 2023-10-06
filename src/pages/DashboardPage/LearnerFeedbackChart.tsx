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
import { CircularProgress, Grid } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';

import ChartWrapper from './ChartWrapper';
import { useStats } from '../../contexts/statsContext';
import { LEARNER_FEEDBACK_TITLE } from '../../config/textConstants';

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

const MessagesChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- Hooks -------------------------------------- //
  const {
    getLearnerFeedbackStats,
    learnerFeedbackStats,
    learnerFeedbackEndDate,
    learnerFeedbackStartDate,
    fetchingLearnerFeedback,
  } = useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getLearnerFeedbackStats) {
      const success = await getLearnerFeedbackStats({ startDate, endDate });

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
      title={LEARNER_FEEDBACK_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={learnerFeedbackStartDate}
      endDate={learnerFeedbackEndDate}
      anchorEl={pickerAnchor}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingLearnerFeedback || !learnerFeedbackStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 372 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Bar data={learnerFeedbackStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default MessagesChart;
