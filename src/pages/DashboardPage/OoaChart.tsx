import { FC, useState } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useStats } from '../../contexts/statsContext';
import { RangeKeyDict } from 'react-date-range';
import ChartWrapper from '../../components/base/ChartWrapper';
import { OOA_TITLE } from '../../config/textConstants';
import { CircularProgress, Grid } from '@material-ui/core';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const options = {
  responsive: true,
};

interface Props {}

const OoaChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- 3rd party hooks ---------------------------- //
  const { getOoaStats, ooaStats, ooaEndDate, ooaStartDate, fetchingOoa } =
    useStats();

  // -------------------------- Hooks -------------------------------------- //

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    const orgIds: number[] = []; // TODO: add org filtering
    if (startDate && endDate && getOoaStats) {
      const success = await getOoaStats({
        startDate,
        endDate,
        orgIds,
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

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={OOA_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={ooaStartDate}
      endDate={ooaEndDate}
      anchorEl={pickerAnchor}
    >
      <>
        {fetchingOoa || !ooaStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Line data={ooaStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default OoaChart;
