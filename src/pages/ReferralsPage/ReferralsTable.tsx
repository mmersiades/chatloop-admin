import React, {FC} from 'react';
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

import {useAppNav} from '../../contexts/appNavContext';
import {Referral} from '../../@types/interfaces';
import {useReferrals} from "../../contexts/referralsContext";
import {getReadableRoles} from "../../helpers/getReadableRoles";

const useStyles = makeStyles(({palette, transitions}: Theme) =>
  createStyles({
    tableContainer: {
      height: 'calc(100vh - 48px)',
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
      height: 'calc(100vh - 138px)',
      display: 'block',
      overflow: 'auto',
    },
    tableRow: {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed',
    },
    headerTableCell: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: palette.common.white,
    },
    tableCell: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    idCell: {
      width: '90px',
    },
    roleCell: {
      width: '90px'
    },
    expiresAtCell: {
      width: '110px'
    },
    spinnerContainer: {
      height: 'calc(100vh - 138px)',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

interface Props {

}

const ReferralsTable: FC<Props> = () => {
  // ----------------------------- Hooks ---------------------------------------- //
  const {
    setShowReferralDrawer,
    setShowNewReferralForm,
  } = useAppNav();

  const {
    fetchingReferrals,
    postingReferral,
    referrals,
    totalReferrals,
    page,
    size,
    changeReferralsPage,
    changeReferralsSize
  } = useReferrals()

  // ----------------------------- Component functions ------------------------- //
  const styles = useStyles();

  const handleChangePage = (event: any, newPage: number) =>
    changeReferralsPage && changeReferralsPage(newPage)


  const handleChangeRowsPerPage = (event: any) =>
    changeReferralsSize && changeReferralsSize(event.target.value)

  // ----------------------------- Render ---------------------------------------- //
  return (
    <TableContainer
      classes={{root: styles.tableContainer}}
      component={Paper}
    >
      <Table size="small">
        <TableHead classes={{root: styles.tableHead}}>
          <TableRow classes={{root: styles.tableRow}}>
            <TableCell
              classes={{root: clsx(styles.headerTableCell, styles.idCell)}}
              align="center"
            >
              id
            </TableCell>
            <TableCell
              classes={{root: clsx(styles.roleCell, styles.headerTableCell)}}
              align="center"
            >
              role
            </TableCell>
            <TableCell
              classes={{root: styles.headerTableCell}}
              align="center"
            >
              refereeName
            </TableCell>
            <TableCell
              classes={{root: styles.headerTableCell}}
              align="center"
            >
              email
            </TableCell>
            <TableCell
              classes={{root: clsx(styles.expiresAtCell, styles.headerTableCell)}}
              align="center"
            >
              expiresAt
            </TableCell>
          </TableRow>
        </TableHead>
        {fetchingReferrals || postingReferral ? (
          <div className={styles.spinnerContainer}>
            <CircularProgress color="primary"/>
          </div>
        ) : (<TableBody classes={{root: styles.tableBody}}>
          {referrals.map((referral: Referral) => (
            <TableRow
              classes={{root: styles.tableRow}}
              key={referral.id}
              hover
              onClick={() => {
                setShowNewReferralForm(false);
                setShowReferralDrawer(referral.id);
              }}
            >
              <TableCell
                classes={{root: clsx(styles.tableCell, styles.idCell)}}
                align="center"
              >
                {referral.id}
              </TableCell>
              <TableCell
                align="center"
                classes={{root: clsx(styles.roleCell, styles.tableCell)}}
              >
                {getReadableRoles(referral.role)}
              </TableCell>
              <TableCell
                align="center"
                classes={{root: styles.tableCell}}
              >
                {referral.refereeName}
              </TableCell>
              <TableCell
                align="center"
                classes={{root: styles.tableCell}}
              >
                {referral.email}
              </TableCell>
              <TableCell
                align="center"
                classes={{root: clsx(styles.expiresAtCell, styles.tableCell)}}
              >
                {referral.expiresAt.split('T')[0]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>)}


        <TableFooter>
          <TableRow>
            <TablePagination
              count={totalReferrals}
              rowsPerPage={size}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default ReferralsTable;
