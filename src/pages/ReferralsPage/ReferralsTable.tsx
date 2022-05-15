import React, { FC } from 'react';
import clsx from 'clsx';
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

import { useAppNav } from '../../contexts/appNavContext';
import { Referral } from '../../@types/interfaces';
import { useReferrals } from '../../contexts/referralsContext';
import { getReadableRoles } from '../../helpers/getReadableRoles';
import { useTableStyles } from '../styles';

interface Props {}

const ReferralsTable: FC<Props> = () => {
  // ----------------------------- Hooks ---------------------------------------- //
  const { setShowReferralDrawer, setShowNewReferralForm } = useAppNav();

  const {
    fetchingReferrals,
    referrals,
    totalReferrals,
    page,
    size,
    changeReferralsPage,
    changeReferralsSize,
  } = useReferrals();

  // ----------------------------- Component functions ------------------------- //
  const tableStyles = useTableStyles();

  const handleChangePage = (event: any, newPage: number) =>
    changeReferralsPage && changeReferralsPage(newPage);

  const handleChangeRowsPerPage = (event: any) =>
    changeReferralsSize && changeReferralsSize(event.target.value);

  // ----------------------------- Render ---------------------------------------- //
  const renderTableHead = () => (
    <TableHead classes={{ root: tableStyles.tableHead }}>
      <TableRow classes={{ root: tableStyles.tableRow }}>
        <TableCell
          classes={{
            root: clsx(tableStyles.headerTableCell, tableStyles.idCell),
          }}
          align="center"
        >
          id
        </TableCell>
        <TableCell
          classes={{
            root: clsx(tableStyles.roleCell, tableStyles.headerTableCell),
          }}
          align="center"
        >
          role
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          refereeName
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          email / phone
        </TableCell>
        <TableCell
          classes={{
            root: clsx(tableStyles.expiresAtCell, tableStyles.headerTableCell),
          }}
          align="center"
        >
          expiresAt
        </TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <>
      {fetchingReferrals ? (
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
              {referrals.map((referral: Referral) => (
                <TableRow
                  classes={{ root: tableStyles.tableRow }}
                  key={referral.id}
                  hover
                  onClick={() => {
                    setShowNewReferralForm(false);
                    setShowReferralDrawer(referral.id);
                  }}
                >
                  <TableCell
                    classes={{
                      root: clsx(tableStyles.tableCell, tableStyles.idCell),
                    }}
                    align="center"
                  >
                    {referral.id}
                  </TableCell>
                  <TableCell
                    align="center"
                    classes={{
                      root: clsx(tableStyles.roleCell, tableStyles.tableCell),
                    }}
                  >
                    {getReadableRoles(referral.role)}
                  </TableCell>
                  <TableCell
                    align="center"
                    classes={{ root: tableStyles.tableCell }}
                  >
                    {referral.refereeName}
                  </TableCell>
                  <TableCell
                    align="center"
                    classes={{ root: tableStyles.tableCell }}
                  >
                    {`${referral.email}${
                      referral.email ?? referral.phone ? ' | ' : ''
                    }${referral.phone ?? referral.phone}`}
                  </TableCell>
                  <TableCell
                    align="center"
                    classes={{
                      root: clsx(
                        tableStyles.expiresAtCell,
                        tableStyles.tableCell
                      ),
                    }}
                  >
                    {referral.expiresAt.split('T')[0]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  data-test="pagination"
                  count={totalReferrals}
                  rowsPerPage={size}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default ReferralsTable;
