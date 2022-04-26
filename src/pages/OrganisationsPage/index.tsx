import React, { FC } from 'react';
import clsx from 'clsx';

import OrganisationsTable from './OrganisationsTable';
import WithNavbar from '../../components/WithNavbar';
import { useAppNav } from '../../contexts/appNavContext';
import OrganisationDrawer from './OrganisationDrawer';
import { Organisation } from '../../@types/interfaces';
import AddOrganisationFab from './AddOrganisationFab';
import { usePageStyles } from '../styles';
import LogoDialog from '../../components/dialogs/LogoDialog';
import { useOrganisations } from '../../contexts/organisationsContext';

interface Props {}

const OrganisationsPage: FC<Props> = () => {
  // -------------------------- Hooks -------------------------------------- //
  const { showOrgDrawer } = useAppNav();
  const { logoDialog, selectOrg } = useOrganisations();

  // -------------------------- Component functions ------------------------ //
  const styles = usePageStyles();

  // -------------------------- Render ------------------------------------- //
  return (
    <div className={styles.container}>
      <div
        className={clsx(styles.innerContainer, {
          [styles.innerContainerShift]: showOrgDrawer,
        })}
      >
        <OrganisationsTable
          handleRowClick={(org: Organisation) => selectOrg && selectOrg(org)}
        />
      </div>
      <OrganisationDrawer />
      <AddOrganisationFab />

      {logoDialog && <LogoDialog {...logoDialog} />}
    </div>
  );
};

export default WithNavbar(OrganisationsPage);
