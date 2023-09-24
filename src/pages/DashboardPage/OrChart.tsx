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
import { OR_TITLE } from '../../config/textConstants';

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

const OrChart: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [pickerAnchor, setPickerAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [orgIds, setOrgIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  let idsRef = useRef<number[]>([]);

  // -------------------------- Hooks -------------------------------------- //
  const { getOrStats, orStats, orEndDate, orStartDate, fetchingOr } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const updateStats = useCallback(async () => {
    if (getOrStats) {
      await getOrStats({
        startDate: startDate || orStartDate,
        endDate: endDate || orEndDate,
        orgIds,
      });
    }
  }, [getOrStats, startDate, orStartDate, endDate, orEndDate, orgIds]);

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
    if (!fetchingOr && !isEqual(orgIds, idsRef.current)) {
      idsRef.current = orgIds;
      // noinspection JSIgnoredPromiseFromCall
      updateStats();
    }
  }, [orgIds, fetchingOr, updateStats]);

  useEffect(() => {
    if (startDate && endDate && !fetchingOr) {
      if (startDate !== orStartDate || endDate !== orEndDate) {
        // noinspection JSIgnoredPromiseFromCall
        updateStats();
      }
    }
  }, [startDate, endDate, updateStats, fetchingOr, orStartDate, orEndDate]);

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={OR_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleDateSelect}
      startDate={orStartDate}
      endDate={orEndDate}
      anchorEl={pickerAnchor}
      setOrgIds={setOrgIds}
      orgIds={orgIds}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingOr || !orStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 400 }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Line data={orStats} options={options} />
        )}
      </>
    </ChartWrapper>
  );
};

export default OrChart;
