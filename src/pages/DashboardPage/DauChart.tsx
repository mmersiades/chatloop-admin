import { FC, MouseEvent, useState } from 'react';
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
import { darkNavy, midBlue, navy } from '../../assets/chatloopTheme';
import { Grid, IconButton, Menu, Typography } from '@material-ui/core';
import { RangeKeyDict } from 'react-date-range';
import DateRangePicker from '../../components/base/DateRangePicker';
import {
  CalendarTodayRounded,
  CalendarViewDayRounded,
} from '@material-ui/icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  // plugins: {
  //   title: {
  //     display: true,
  //     text: 'Chart.js Bar Chart - Stacked',
  //   },
  // },
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

const labels = [
  '2022-04-18',
  '2022-04-19',
  '2022-04-20',
  '2022-04-21',
  '2022-04-22',
  '2022-04-23',
  '2022-04-24',
];

const data = {
  labels,
  datasets: [
    {
      label: 'Learners',
      data: [4, 5, 4, 5, 4, 4, 2],
      backgroundColor: navy,
    },
    {
      label: 'Partners',
      data: [3, 4, 5, 5, 5, 3, 4],
      backgroundColor: darkNavy,
    },
    {
      label: 'Tutors',
      data: [1, 1, 1, 1, 1, 1, 1],
      backgroundColor: midBlue,
    },
  ],
};
const defaultStartDate = new Date();
defaultStartDate.setDate(defaultStartDate.getDate() - 7);
const defaultEndDate = new Date();

interface Props {}

const DauChart: FC<Props> = ({}) => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //

  // -------------------------- Component functions ------------------------ //
  const handleSelect = (ranges: RangeKeyDict) => {
    setStartDate(ranges['selection'].startDate as Date);
    setEndDate(ranges['selection'].endDate as Date);
    console.log(ranges['selection']);
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
          startDate={startDate}
          endDate={endDate}
        />
      </Menu>

      <Bar data={data} options={options} />
    </>
  );
};

export default DauChart;
