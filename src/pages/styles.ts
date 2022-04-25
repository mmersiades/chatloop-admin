import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const usePageStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    container: {
      height: '100%',
      width: '100%',
    },
    innerContainer: {
      height: '100%',
      width: '100%',
      backgroundColor: palette.common.white,
    },
    innerContainerShift: {
      width: '70%',
      transition: transitions.create('width', {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
    },
  })
);

export const useTableStyles = makeStyles(({ palette, transitions }: Theme) =>
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
      width: '90px',
    },
    logoCell: {
      padding: '4px',
      width: '48px',
    },
    expiresAtCell: {
      width: '110px',
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

export const useDrawerStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    docked: {
      top: 48,
      width: '30%',
      overflowY: 'unset',
      height: 'calc(100vh - 48px)',
    },
    dockedWithMenuDrawer: {
      width: 'calc((100vw - 150px) * 0.3)',
    },
    closeButton: {
      marginRight: spacing(2),
    },
    appbar: {
      height: 36,
    },
    toolbar: {
      minHeight: 36,
    },
    spinnerContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    list: {
      overflowY: 'auto',
    },
    deleteButton: {
      color: palette.error.main,
    },
  })
);

export const useFabStyles = makeStyles(() =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: 8,
      left: 8,
    },
  })
);
