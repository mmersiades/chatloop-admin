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
import ChartWrapper from '../../components/base/ChartWrapper';
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

const ActivitiesInProgressChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const {
    getActivitiesInProgressStats,
    activitiesInProgressStats,
    activitiesInProgressEndDate,
    activitiesInProgressStartDate,
    fetchingActivitiesInProgress,
  } = useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getActivitiesInProgressStats) {
      const success = await getActivitiesInProgressStats({
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

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={ACTIVITIES_IN_PROGRESS_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={activitiesInProgressStartDate}
      endDate={activitiesInProgressEndDate}
      anchorEl={pickerAnchor}
    >
      <>
        {fetchingActivitiesInProgress || !activitiesInProgressStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Bar data={activitiesInProgressStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default ActivitiesInProgressChart;
