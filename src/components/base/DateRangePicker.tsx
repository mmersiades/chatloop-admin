import { FC } from 'react';
import { DateRangePicker as RDRPicker, RangeKeyDict } from 'react-date-range';

import '../../assets/rangepicker.css';
import '../../assets/rangepicker_default.css';

import { darkNavy, midBlue, navy } from '../../assets/chatloopTheme';

interface Props {
  handleSelect: (ranges: RangeKeyDict) => void;
  startDate: Date;
  endDate: Date;
}

const DateRangePicker: FC<Props> = ({ handleSelect, startDate, endDate }) => {
  // -------------------------- Component state ---------------------------- //

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //

  // -------------------------- Component functions ------------------------ //

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  return (
    <RDRPicker
      ranges={[
        {
          startDate,
          endDate,
          key: 'selection',
        },
      ]}
      onChange={handleSelect}
      rangeColors={[midBlue, navy, darkNavy]}
    />
  );
};

export default DateRangePicker;
