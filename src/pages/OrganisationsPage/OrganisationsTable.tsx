import React, { FC } from 'react';
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
import clsx from 'clsx';

import { useAppNav } from '../../contexts/appNavContext';
import { useOrganisations } from '../../contexts/organisationsContext';
import { Organisation } from '../../@types/interfaces';

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
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
    spinnerContainer: {
      height: 'calc(100vh - 48px)',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

interface Props {}

const OrganisationsTable: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const { setShowOrgDrawer, setShowNewOrgForm } = useAppNav();
  const { organisations, fetchingOrganisations } = useOrganisations();

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //

  // -------------------------- Component functions ------------------------ //
  const styles = useStyles();

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  const renderTableHead = () => (
    <TableHead classes={{ root: styles.tableHead }}>
      <TableRow classes={{ root: styles.tableRow }}>
        <TableCell
          classes={{ root: clsx(styles.headerTableCell, styles.idCell) }}
          align="center"
        >
          id
        </TableCell>
        <TableCell classes={{ root: styles.headerTableCell }} align="center">
          officialName
        </TableCell>
        <TableCell classes={{ root: styles.headerTableCell }} align="center">
          country
        </TableCell>
        <TableCell classes={{ root: styles.headerTableCell }} align="center">
          administrativeArea
        </TableCell>
      </TableRow>
    </TableHead>
  );
  return (
    <>
      {fetchingOrganisations ? (
        <>
          <Table size="small">{renderTableHead()}</Table>

          <div className={styles.spinnerContainer}>
            <CircularProgress color="primary" />
          </div>
        </>
      ) : (
        <TableContainer
          classes={{ root: styles.tableContainer }}
          component={Paper}
        >
          <Table size="small">
            {renderTableHead()}

            <TableBody classes={{ root: styles.tableBody }}>
              {organisations.map((org: Organisation) => (
                <TableRow
                  classes={{ root: styles.tableRow }}
                  key={org.id}
                  hover
                  onClick={() => {
                    setShowNewOrgForm(false);
                    setShowOrgDrawer(org.id);
                  }}
                >
                  <TableCell
                    classes={{ root: clsx(styles.tableCell, styles.idCell) }}
                    align="center"
                  >
                    {org.id}
                  </TableCell>
                  <TableCell
                    align="center"
                    classes={{ root: styles.tableCell }}
                  >
                    {org.officialName}
                  </TableCell>
                  <TableCell
                    align="center"
                    classes={{ root: styles.tableCell }}
                  >
                    {org.addressCountry}
                  </TableCell>
                  <TableCell
                    align="center"
                    classes={{ root: styles.tableCell }}
                  >
                    {org.addressLevel3}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                {/*<TablePagination*/}
                {/*  data-test="pagination"*/}
                {/*  count={totalReferrals}*/}
                {/*  rowsPerPage={size}*/}
                {/*  page={page}*/}
                {/*  onPageChange={handleChangePage}*/}
                {/*  onRowsPerPageChange={handleChangeRowsPerPage}*/}
                {/*  ActionsComponent={TablePaginationActions}*/}
                {/*/>*/}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default OrganisationsTable;
