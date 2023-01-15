import React, { FC } from 'react';
import {
  CheckRounded,
  CloseRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from '@material-ui/icons';
import {
  CircularProgress,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
  TablePagination,
  TableFooter,
  Link,
} from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import clsx from 'clsx';

import WithNavbar from '../../components/WithNavbar';
import { useLearners } from '../../contexts/learnersContext';
import { LearnerSortProperty } from '../../services/learnersService';
import { usePageStyles, useTableStyles } from '../styles';
import {
  TABLE_SIZE_OPTIONS_DEV,
  TABLE_SIZE_OPTIONS_PROD,
} from '../../config/constants';

const env = process.env.REACT_APP_ENV;

interface Props {}

const LearnersPage: FC<Props> = () => {
  // -------------------------- Hooks -------------------------------------- //
  const {
    fetching,
    learners,
    page,
    size,
    sort,
    ascending,
    totalElements,
    changePageNumber,
    changePageSize,
    changeSort,
    changeSortDirection,
  } = useLearners();

  // -------------------------- Component functions ------------------------ //
  const pageStyles = usePageStyles();
  const tableStyles = useTableStyles();

  const handleChangePage = (event: any, newPage: number) =>
    changePageNumber!(newPage);

  const handleChangeRowsPerPage = (event: any) =>
    changePageSize!(event.target.value);

  // -------------------------- Render ------------------------------------- //
  const renderHeaderCellContent = (
    sortValue: LearnerSortProperty,
    label: string
  ) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Link
        style={{ color: '#fff', cursor: 'pointer' }}
        underline={sort === sortValue ? 'always' : 'hover'}
        onClick={() => changeSort!(sortValue)}
      >
        {label}
      </Link>
      {ascending === 'true' ? (
        <KeyboardArrowDownRounded
          style={{
            marginLeft: 8,
            cursor: 'pointer',
          }}
          onClick={() => changeSortDirection!(sortValue, 'false')}
        />
      ) : (
        <KeyboardArrowUpRounded
          style={{
            marginLeft: 8,
            cursor: 'pointer',
          }}
          onClick={() => changeSortDirection!(sortValue, 'true')}
        />
      )}
    </div>
  );

  const renderTableHead = () => (
    <TableHead classes={{ root: tableStyles.tableHead }}>
      <TableRow classes={{ root: tableStyles.tableRow }}>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent('displayName', 'Name')}
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent('lastActiveDate', 'Last Active')}
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent('currentActivities', 'Activities')}
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent(
            'currentNewActivityRequests',
            'Activity Reqs'
          )}
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent('isActive', 'Active')}
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent('isDisadvantaged', 'Disadvantaged')}
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent('uiLanguage', 'UI')}
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent('referringOrg', 'Referred by')}
        </TableCell>
        <TableCell
          classes={{
            root: clsx(tableStyles.headerTableCell, tableStyles.idCell),
          }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          {renderHeaderCellContent('id', 'Id')}
        </TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <div className={pageStyles.container}>
      {fetching ? (
        <>
          <Table size="small">{renderTableHead()}</Table>

          <div className={tableStyles.spinnerContainer}>
            <CircularProgress color="primary" />
          </div>
        </>
      ) : (
        <TableContainer
          classes={{ root: tableStyles.tableContainer }}
          component={Paper}
        >
          <Table size="small">
            {renderTableHead()}
            <TableBody classes={{ root: tableStyles.tableBody }}>
              {learners.map((learner) => {
                return (
                  <TableRow
                    classes={{ root: tableStyles.tableRow }}
                    key={learner.id}
                    hover
                  >
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.displayName}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.lastActiveDate}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.currentActivities}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.currentNewActivityRequests}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.active ? <CheckRounded /> : <CloseRounded />}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.disadvantaged ? (
                        <CheckRounded />
                      ) : (
                        <CloseRounded />
                      )}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.uiLanguage}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.referringOrg}
                    </TableCell>
                    <TableCell
                      classes={{
                        root: clsx(tableStyles.tableCell, tableStyles.idCell),
                      }}
                      align="center"
                      sortDirection={ascending === 'true' ? 'asc' : 'desc'}
                    >
                      {learner.id}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  data-test="pagination"
                  count={totalElements}
                  rowsPerPage={size}
                  page={page}
                  rowsPerPageOptions={
                    env === 'prod'
                      ? TABLE_SIZE_OPTIONS_PROD
                      : TABLE_SIZE_OPTIONS_DEV
                  }
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default WithNavbar(LearnersPage);
