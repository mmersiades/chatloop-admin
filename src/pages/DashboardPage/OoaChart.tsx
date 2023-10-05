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
import { CircularProgress, Grid } from '@material-ui/core';
import { RangeKeyDict } from 'react-date-range';
import { Line } from 'react-chartjs-2';
import { isEqual } from 'lodash';

import ChartWrapper from './ChartWrapper';
import { useStats } from '../../contexts/statsContext';
import { OOA_TITLE } from '../../config/textConstants';

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
  const [orgIds, setOrgIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  let idsRef = useRef<number[]>([]);

  // -------------------------- 3rd party hooks ---------------------------- //
  const { getOoaStats, ooaStats, ooaEndDate, ooaStartDate, fetchingOoa } =
    useStats();

  // -------------------------- Hooks -------------------------------------- //

  // -------------------------- Component functions ------------------------ //
  const updateStats = useCallback(async () => {
    if (getOoaStats) {
      await getOoaStats({
        startDate: startDate || ooaStartDate,
        endDate: endDate || ooaEndDate,
        orgIds,
      });
    }
  }, [getOoaStats, startDate, ooaStartDate, endDate, ooaEndDate, orgIds]);

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
    if (!fetchingOoa && !isEqual(orgIds, idsRef.current)) {
      idsRef.current = orgIds;
      // noinspection JSIgnoredPromiseFromCall
      updateStats();
    }
  }, [orgIds, fetchingOoa, updateStats]);

  useEffect(() => {
    if (startDate && endDate && !fetchingOoa) {
      if (startDate !== ooaStartDate || endDate !== ooaEndDate) {
        // noinspection JSIgnoredPromiseFromCall
        updateStats();
      }
    }
  }, [startDate, endDate, updateStats, fetchingOoa, ooaStartDate, ooaEndDate]);

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={OOA_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleDateSelect}
      startDate={ooaStartDate}
      endDate={ooaEndDate}
      anchorEl={pickerAnchor}
      setOrgIds={setOrgIds}
      orgIds={orgIds}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingOoa || !ooaStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 372 }}
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
