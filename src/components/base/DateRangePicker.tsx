import { FC } from 'react';
import {
  DateRangePicker as RDRPicker,
  RangeKeyDict,
  defaultStaticRanges,
  createStaticRanges,
} from 'react-date-range';
import moment from 'moment';

import '../../assets/rangepicker.css';
import '../../assets/rangepicker_default.css';

import { darkNavy, midBlue, navy } from '../../assets/chatloopTheme';

interface Props {
  handleSelect: (ranges: RangeKeyDict) => void;
  startDate: Date;
  endDate: Date;
}

const isSameRange = (
  startDate1?: Date,
  startDate2?: Date,
  endDate1?: Date,
  endDate2?: Date
) => {
  return (
    startDate1?.toDateString() === startDate2?.toDateString() &&
    endDate1?.toDateString() === endDate2?.toDateString()
  );
};

const today = moment();
const extendedRanges = createStaticRanges([
  {
    label: '30 days to today',
    range: () => ({
      startDate: moment().subtract(30, 'days').toDate(),
      endDate: today.toDate(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return isSameRange(
        range.startDate,
        definedRange.startDate,
        range.endDate,
        definedRange.endDate
      );
    },
  },
  {
    label: '90 days to today',
    range: () => ({
      startDate: moment().subtract(90, 'days').toDate(),
      endDate: today.toDate(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return isSameRange(
        range.startDate,
        definedRange.startDate,
        range.endDate,
        definedRange.endDate
      );
    },
  },
  {
    label: '180 days to today',
    range: () => ({
      startDate: moment().subtract(180, 'days').toDate(),
      endDate: today.toDate(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return isSameRange(
        range.startDate,
        definedRange.startDate,
        range.endDate,
        definedRange.endDate
      );
    },
  },
  {
    label: '365 days to today',
    range: () => ({
      startDate: moment().subtract(365, 'days').toDate(),
      endDate: today.toDate(),
    }),
    isSelected(range) {
      const definedRange = this.range();
      return isSameRange(
        range.startDate,
        definedRange.startDate,
        range.endDate,
        definedRange.endDate
      );
    },
  },
]);

const truncatedRanges = [...defaultStaticRanges].splice(2);

const DateRangePicker: FC<Props> = ({ handleSelect, startDate, endDate }) => (
  <RDRPicker
    ranges={[
      {
        startDate,
        endDate,
        key: 'selection',
      },
    ]}
    staticRanges={[...truncatedRanges, ...extendedRanges]}
    inputRanges={[]}
    onChange={handleSelect}
    rangeColors={[midBlue, navy, darkNavy]}
    retainEndDateOnFirstSelection
  />
);

export default DateRangePicker;
