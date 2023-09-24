import { FC, useCallback, useEffect, useRef, useState } from 'react';
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
import { isEqual } from 'lodash';

import ChartWrapper from './ChartWrapper';
import { useStats } from '../../contexts/statsContext';
import { OAR_TITLE } from '../../config/textConstants';

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

const OarChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [orgIds, setOrgIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  let idsRef = useRef<number[]>([]);

  // -------------------------- Hooks -------------------------------------- //
  const { getOarStats, oarStats, oarEndDate, oarStartDate, fetchingOar } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const updateStats = useCallback(async () => {
    if (getOarStats) {
      await getOarStats({
        startDate: startDate || oarStartDate,
        endDate: endDate || oarEndDate,
        orgIds,
      });
    }
  }, [getOarStats, startDate, oarStartDate, endDate, oarEndDate, orgIds]);

  const handleDateSelect = (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges['selection'];
    setStartDate(startDate);
    setEndDate(endDate);
    setPickerAnchor(null);
  };

  const togglePicker = (event: any) => {
    if (pickerAnchor !== null) {
      setPickerAnchor(null);
    } else {
      setPickerAnchor(event.currentTarget);
    }
  };

  const minDate = new Date('2022-06-10');
  const maxDate = new Date();

  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    if (!fetchingOar && !isEqual(orgIds, idsRef.current)) {
      idsRef.current = orgIds;
      // noinspection JSIgnoredPromiseFromCall
      updateStats();
    }
  }, [orgIds, fetchingOar, updateStats]);

  useEffect(() => {
    if (startDate && endDate && !fetchingOar) {
      if (startDate !== oarStartDate || endDate !== oarEndDate) {
        // noinspection JSIgnoredPromiseFromCall
        updateStats();
      }
    }
  }, [startDate, endDate, updateStats, fetchingOar, oarStartDate, oarEndDate]);

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={OAR_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleDateSelect}
      startDate={oarStartDate}
      endDate={oarEndDate}
      anchorEl={pickerAnchor}
      setOrgIds={setOrgIds}
      orgIds={orgIds}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingOar || !oarStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Line data={oarStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default OarChart;
