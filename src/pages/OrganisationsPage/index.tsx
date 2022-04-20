import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

import OrganisationsTable from './OrganisationsTable';
import WithNavbar from '../../components/WithNavbar';
import { useAppNav } from '../../contexts/appNavContext';

interface Props {}

const useStyles = makeStyles(({ palette, transitions }: Theme) =>
  createStyles({
    orgsContainer: {
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

const OrganisationsPage: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const { showNewOrgForm, showOrgDrawer } = useAppNav();

  // -------------------------- Component functions ------------------------ //
  const styles = useStyles();

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  return (
    <div className={styles.orgsContainer}>
      <div
        className={clsx(styles.innerContainer, {
          [styles.innerContainerShift]: showNewOrgForm || showOrgDrawer,
        })}
      >
        <OrganisationsTable />
      </div>
    </div>
  );
};

export default WithNavbar(OrganisationsPage);
