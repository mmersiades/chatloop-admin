import { FC, PropsWithChildren } from 'react';
import { IconButton, Menu, Typography } from '@material-ui/core';
import { CalendarTodayRounded } from '@material-ui/icons';
import DateRangePicker from './DateRangePicker';
import { RangeKeyDict } from 'react-date-range';

interface Props {
  title: string;
  open: boolean;
  togglePicker: (event: any) => void;
  handleClose: () => void;
  handleSelect: (ranges: RangeKeyDict) => void;
  startDate: Date;
  endDate: Date;
  anchorEl?: Element | ((element: Element) => Element) | null;
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
}) => {
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
        <IconButton onClick={togglePicker}>
          <CalendarTodayRounded />
        </IconButton>
      </div>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <DateRangePicker
          handleSelect={handleSelect}
          startDate={startDate}
          endDate={endDate}
        />
      </Menu>

      {children}
    </>
  );
};

export default ChartWrapper;
