import React, { FC } from 'react';
import WithNavbar from '../../components/WithNavbar';
import { useLearners } from '../../contexts/learnersContext';
import { usePageStyles, useTableStyles } from '../styles';
import { CheckRounded, CloseRounded } from '@material-ui/icons';
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
import clsx from 'clsx';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import {
  TABLE_SIZE_OPTIONS_DEV,
  TABLE_SIZE_OPTIONS_PROD,
} from '../../config/constants';

const env = process.env.REACT_APP_ENV;

interface Props {}

const LearnersPage: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const {
    fetching,
    learners,
    page,
    size,
    ascending,
    sort,
    totalElements,
    changePageNumber,
    changePageSize,
    changeSort,
  } = useLearners();

  // -------------------------- Component functions ------------------------ //
  const styles = usePageStyles();
  const tableStyles = useTableStyles();

  const handleChangePage = (event: any, newPage: number) =>
    changePageNumber!(newPage);

  const handleChangeRowsPerPage = (event: any) =>
    changePageSize!(event.target.value);

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  const renderTableHead = () => (
    <TableHead classes={{ root: tableStyles.tableHead }}>
      <TableRow classes={{ root: tableStyles.tableRow }}>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('displayName')}
          >
            Name
          </Link>
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('lastActiveDate')}
          >
            Last Active
          </Link>
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('currentActivities')}
          >
            Activities
          </Link>
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('currentNewActivityRequests')}
          >
            Activity Reqs
          </Link>
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('isActive')}
          >
            Active
          </Link>
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('isDisadvantaged')}
          >
            Disadvantaged
          </Link>
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('uiLanguage')}
          >
            UI
          </Link>
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('referringOrg')}
          >
            Org
          </Link>
        </TableCell>
        <TableCell
          classes={{
            root: clsx(tableStyles.headerTableCell, tableStyles.idCell),
          }}
          align="center"
          sortDirection={ascending === 'true' ? 'asc' : 'desc'}
        >
          <Link
            style={{ color: '#fff', cursor: 'pointer' }}
            underline={'hover'}
            onClick={() => changeSort!('id')}
          >
            Id
          </Link>
        </TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <div className={styles.container}>
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
