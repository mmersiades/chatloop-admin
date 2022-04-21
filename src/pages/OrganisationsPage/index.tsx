import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';

import OrganisationsTable from './OrganisationsTable';
import WithNavbar from '../../components/WithNavbar';
import { useAppNav } from '../../contexts/appNavContext';
import OrganisationDrawer from './OrganisationDrawer';
import { Organisation } from '../../@types/interfaces';
import AddOrganisationFab from './AddOrganisationFab';
import { usePageStyles } from '../styles';

interface Props {}

const OrganisationsPage: FC<Props> = () => {
  // -------------------------- Component state ---------------------------- //
  const [selectedOrg, setSelectedOrg] = useState<Organisation | undefined>(
    undefined
  );

  // -------------------------- Hooks -------------------------------------- //
  const { showOrgDrawer } = useAppNav();

  // -------------------------- Component functions ------------------------ //
  const styles = usePageStyles();

  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    !showOrgDrawer && setSelectedOrg(undefined);
  }, [showOrgDrawer]);

  // -------------------------- Render ------------------------------------- //
  return (
    <div className={styles.container}>
      <div
        className={clsx(styles.innerContainer, {
          [styles.innerContainerShift]: showOrgDrawer,
        })}
      >
        <OrganisationsTable
          handleRowClick={(org: Organisation) => setSelectedOrg(org)}
        />
      </div>
      <OrganisationDrawer org={selectedOrg} />
      <AddOrganisationFab />
    </div>
  );
};

export default WithNavbar(OrganisationsPage);
