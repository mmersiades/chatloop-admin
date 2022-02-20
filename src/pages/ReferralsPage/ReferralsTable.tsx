import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  CircularProgress,
  createStyles,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Theme,
} from '@material-ui/core';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

import { useAppNav } from '../../contexts/appNavContext';
import { Referral } from '../../@types/interfaces';

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    tableContainer: {
      height: 'calc(100vh - 96px)',
      borderRadius: '0px',
      width: '100%',
      transition: transitions.create('width', {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    tableContainerShift: {
      width: '70%',
      transition: transitions.create('width', {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
    tableHead: {
      backgroundColor: palette.primary.main,
    },
    tableBody: {
      height: 'calc(100vh - 184px)',
      display: 'block',
      overflow: 'auto',
    },
    tableRow: {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed',
    },
    tableCell: {
      color: palette.common.white,
    },
    idCell: {
      width: '100px',
    },
    spinnerContainer: {
      height: 'calc(100vh - 96px)',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

interface Props {
  referrals: Referral[];
  loading: boolean;
}

const ReferralsTable: FC<Props> = ({ referrals, loading }) => {
  // ----------------------------- Component state ------------------------------ //
  // The current table page (for table pagination)
  const [page, setPage] = useState(0);

  // The number of rows per table page (for table pagination)
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [pageRows, setPageRows] = useState<Referral[]>([]);
  // ----------------------------- Hooks ---------------------------------------- //
  const {
    showReferralDrawer,
    setShowReferralDrawer,
    showNewReferralForm,
    setShowNewReferralForm,
  } = useAppNav();

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (referrals.length > 0) {
      const rows =
        referrals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ||
        [];

      setPageRows(rows);
    }
  }, [page, referrals, rowsPerPage]);

  // ----------------------------- Render ---------------------------------------- //
  return (
    <>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <TableContainer
          classes={{ root: styles.tableContainer }}
          component={Paper}
        >
          <Table size="small">
            <TableHead classes={{ root: styles.tableHead }}>
              <TableRow classes={{ root: styles.tableRow }}>
                <TableCell
                  classes={{ root: clsx(styles.tableCell, styles.idCell) }}
                  align="center"
                >
                  id
                </TableCell>
                <TableCell classes={{ root: styles.tableCell }} align="center">
                  referreeName
                </TableCell>
                <TableCell classes={{ root: styles.tableCell }} align="center">
                  email
                </TableCell>
                <TableCell classes={{ root: styles.tableCell }} align="center">
                  expiresAt
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody classes={{ root: styles.tableBody }}>
              {pageRows.map((referral: Referral) => (
                <TableRow
                  classes={{ root: styles.tableRow }}
                  key={referral.id}
                  hover
                  onClick={() => {
                    setShowNewReferralForm(false);
                    setShowReferralDrawer(referral.id);
                  }}
                >
                  <TableCell classes={{ root: styles.idCell }} align="center">
                    {referral.id}
                  </TableCell>
                  <TableCell align="center">{referral.referreeName}</TableCell>
                  <TableCell align="center">{referral.email}</TableCell>
                  <TableCell align="center">
                    {referral.expiresAt.split('T')[0]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  count={referrals.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
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
