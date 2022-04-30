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
import ChartWrapper from '../../components/base/ChartWrapper';

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

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const {
    getMessagesStats,
    messagesStats,
    messagesEndDate,
    messagesStartDate,
    fetchingMessages,
  } = useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    if (startDate && endDate && getMessagesStats) {
      const success = await getMessagesStats({ startDate, endDate });

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
      title="Messages"
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={messagesStartDate}
      endDate={messagesEndDate}
      anchorEl={pickerAnchor}
    >
      <>
        {fetchingMessages || !messagesStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Bar data={messagesStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default MessagesChart;
