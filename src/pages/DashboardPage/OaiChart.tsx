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
  const [orgIds, setOrgIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  let idsRef = useRef<number[]>([]);

  // -------------------------- Hooks -------------------------------------- //
  const { getOaiStats, oaiStats, oaiEndDate, oaiStartDate, fetchingOai } =
    useStats();

  // -------------------------- Component functions ------------------------ //
  const updateStats = useCallback(async () => {
    if (getOaiStats) {
      await getOaiStats({
        startDate: startDate || oaiStartDate,
        endDate: endDate || oaiEndDate,
        orgIds,
      });
    }
  }, [getOaiStats, startDate, oaiStartDate, endDate, oaiEndDate, orgIds]);

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
    if (!fetchingOai && !isEqual(orgIds, idsRef.current)) {
      idsRef.current = orgIds;
      // noinspection JSIgnoredPromiseFromCall
      updateStats();
    }
  }, [orgIds, fetchingOai, updateStats]);

  useEffect(() => {
    if (startDate && endDate && !fetchingOai) {
      if (startDate !== oaiStartDate || endDate !== oaiEndDate) {
        // noinspection JSIgnoredPromiseFromCall
        updateStats();
      }
    }
  }, [startDate, endDate, updateStats, fetchingOai, oaiStartDate, oaiEndDate]);

  // -------------------------- Render ------------------------------------- //
  return (
    <ChartWrapper
      title={OAI_TITLE}
      open={Boolean(pickerAnchor)}
      togglePicker={togglePicker}
      handleClose={() => setPickerAnchor(null)}
      handleSelect={handleDateSelect}
      startDate={oaiStartDate}
      endDate={oaiEndDate}
      anchorEl={pickerAnchor}
      setOrgIds={setOrgIds}
      orgIds={orgIds}
      minDate={minDate}
      maxDate={maxDate}
    >
      <>
        {fetchingOai || !oaiStats ? (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{ height: 372 }}
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
