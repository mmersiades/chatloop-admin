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
import {
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  Typography,
} from '@material-ui/core';
import { RangeKeyDict } from 'react-date-range';
import DateRangePicker from '../../components/base/DateRangePicker';
import { CalendarTodayRounded } from '@material-ui/icons';
import { useStats } from '../../contexts/statsContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ChartJS.defaults.font.family = 'Roboto';

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

  // -------------------------- 3rd party hooks ---------------------------- //

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
  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" component="span">
          Daily Active Users
        </Typography>
        <IconButton onClick={togglePicker}>
          <CalendarTodayRounded />
        </IconButton>
      </div>
      <Menu
        anchorEl={pickerAnchor}
        open={Boolean(pickerAnchor)}
        onClose={() => setPickerAnchor(null)}
      >
        <DateRangePicker
          handleSelect={handleSelect}
          startDate={dauStartDate}
          endDate={dauEndDate}
        />
      </Menu>

      {fetchingDau || !dauStats ? (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          style={{ height: 400 }}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <Bar data={dauStats} options={options} />
      )}
    </>
  );
};

export default DauChart;
