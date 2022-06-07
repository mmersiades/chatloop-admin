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
import { RangeKeyDict } from 'react-date-range';
import { CircularProgress, Grid } from '@material-ui/core';
import { Line } from 'react-chartjs-2';

import ChartWrapper from '../../components/base/ChartWrapper';
import { useStats } from '../../contexts/statsContext';
import { OAI_TITLE } from '../../config/textConstants';

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

const OaiChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  // -------------------------- Hooks -------------------------------------- //
  const { getOaiStats, oaiStats, oaiEndDate, oaiStartDate, fetchingOai } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const handleSelect = async (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    const orgIds: number[] = []; // TODO: add org filtering
    if (startDate && endDate && getOaiStats) {
      const success = await getOaiStats({
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
      title={OAI_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleSelect}
      startDate={oaiStartDate}
      endDate={oaiEndDate}
      anchorEl={pickerAnchor}
    >
      <>
        {fetchingOai || !oaiStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Line data={oaiStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default OaiChart;
