import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';
import { Collapse, IconButton, Menu, Typography } from '@material-ui/core';
import {
  CalendarTodayRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
} from '@material-ui/icons';
import DateRangePicker from '../../components/base/DateRangePicker';
import { RangeKeyDict } from 'react-date-range';

import OrgFilters from './OrgFilters';

interface Props {
  title: string;
  open: boolean;
  togglePicker: (event: any) => void;
  handleClose: () => void;
  handleSelect: (ranges: RangeKeyDict) => void;
  startDate: Date;
  endDate: Date;
  anchorEl?: Element | ((element: Element) => Element) | null;
  setOrgIds?: Dispatch<SetStateAction<number[]>>;
  orgIds?: number[];
  minDate?: Date;
  maxDate?: Date;
}

const ChartWrapper: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  handleClose,
  endDate,
  startDate,
  handleSelect,
  togglePicker,
  open,
  anchorEl,
  setOrgIds,
  orgIds,
  minDate,
  maxDate,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters(!showFilters);
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
          {title}
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {setOrgIds && orgIds && (
            <IconButton onClick={toggleFilters}>
              {showFilters ? <ExpandLessRounded /> : <ExpandMoreRounded />}
            </IconButton>
          )}
          <IconButton onClick={togglePicker}>
            <CalendarTodayRounded />
          </IconButton>
        </div>
      </div>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <DateRangePicker
          handleSelect={handleSelect}
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Menu>
      <Collapse in={showFilters}>
        {setOrgIds && orgIds && (
          <OrgFilters setOrgIds={setOrgIds} orgIds={orgIds} />
        )}
      </Collapse>

      {children}
    </>
  );
};

export default ChartWrapper;
