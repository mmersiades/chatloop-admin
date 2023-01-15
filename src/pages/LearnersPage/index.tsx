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
} from '@material-ui/core';
import clsx from 'clsx';

interface Props {}

const LearnersPage: FC<Props> = ({}) => {
  // -------------------------- Component state ---------------------------- //

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const { fetching, learners } = useLearners();

  // -------------------------- Component functions ------------------------ //
  const styles = usePageStyles();
  const tableStyles = useTableStyles();

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  const renderTableHead = () => (
    <TableHead classes={{ root: tableStyles.tableHead }}>
      <TableRow classes={{ root: tableStyles.tableRow }}>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          Name
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          Last Active
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          Activities
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          Activity Reqs
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          Active
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          Disadvantaged
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          UI
        </TableCell>
        <TableCell
          classes={{ root: tableStyles.headerTableCell }}
          align="center"
        >
          Org
        </TableCell>
        <TableCell
          classes={{
            root: clsx(tableStyles.headerTableCell, tableStyles.idCell),
          }}
          align="center"
        >
          Id
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
                    >
                      {learner.displayName}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                    >
                      {learner.lastActiveDate}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                    >
                      {learner.currentActivities}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                    >
                      {learner.currentNewActivityRequests}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                    >
                      {learner.active ? <CheckRounded /> : <CloseRounded />}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
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
                    >
                      {learner.uiLanguage}
                    </TableCell>
                    <TableCell
                      classes={{ root: tableStyles.tableCell }}
                      align="center"
                    >
                      {learner.referringOrg}
                    </TableCell>
                    <TableCell
                      classes={{
                        root: clsx(tableStyles.tableCell, tableStyles.idCell),
                      }}
                      align="center"
                    >
                      {learner.id}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default WithNavbar(LearnersPage);
