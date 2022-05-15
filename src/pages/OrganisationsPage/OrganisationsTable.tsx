import React, { ChangeEventHandler, FC, useState } from 'react';
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
import clsx from 'clsx';

import { useAppNav } from '../../contexts/appNavContext';
import { useOrganisations } from '../../contexts/organisationsContext';
import { Organisation } from '../../@types/interfaces';
import { useTableStyles } from '../styles';
import { DEFAULT_ORGANISATIONS_PAGE_SIZE } from '../../config/constants';

interface Props {
  handleRowClick: (org: Organisation) => void;
}

const OrganisationsTable: FC<Props> = ({ handleRowClick }) => {
  // -------------------------- Component state ---------------------------- //
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_ORGANISATIONS_PAGE_SIZE);

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const { setShowOrgDrawer } = useAppNav();
  const { organisations, fetching } = useOrganisations();

  // -------------------------- Component functions ------------------------ //
  const styles = useTableStyles();

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    setPage(page);
  };

  const handleChangeRowsPerPage: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setSize(parseInt(event.target.value));
    setPage(0);
  };

  const getLogoUrl = (org: Organisation): string | null =>
    org.wordmark || org.logo;

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
        <TableCell
          classes={{ root: clsx(styles.headerTableCell, styles.logoCell) }}
          align="center"
        >
          logo
        </TableCell>
        <TableCell classes={{ root: styles.headerTableCell }} align="center">
          officialName
        </TableCell>
        <TableCell classes={{ root: styles.headerTableCell }} align="center">
          administrativeArea
        </TableCell>
        <TableCell classes={{ root: styles.headerTableCell }} align="center">
          country
        </TableCell>
      </TableRow>
    </TableHead>
  );
  return (
    <>
      {fetching ? (
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
              {organisations
                .slice(page * size, page * size + size)
                .map((org: Organisation) => (
                  <TableRow
                    classes={{ root: styles.tableRow }}
                    key={org.id}
                    hover
                    onClick={() => {
                      setShowOrgDrawer(true);
                      handleRowClick(org);
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
                      classes={{
                        root: clsx(styles.tableCell, styles.logoCell),
                      }}
                    >
                      {!!getLogoUrl(org) && (
                        <img
                          src={getLogoUrl(org) || ''}
                          height="16px"
                          style={{ marginTop: '4px' }}
                          alt={`${org.shortName || org.officialName}'s logo`}
                        />
                      )}
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
                      {org.administrativeArea}
                    </TableCell>
                    <TableCell
                      align="center"
                      classes={{ root: styles.tableCell }}
                    >
                      {org.country}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  data-test="pagination"
                  count={organisations.length}
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

export default OrganisationsTable;
