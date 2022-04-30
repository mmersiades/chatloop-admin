import { FC } from 'react';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { List, ListItem, Typography } from '@material-ui/core';

import OrgAdminCard from './OrgAdminCard';
import { OrgFormValues } from './OrganisationForm';
import { OrgAdminDTO } from '../../@types/interfaces';

interface Props {
  orgName: string;
  fieldProps: ControllerRenderProps<OrgFormValues, 'adminIds'>;
  handleDeleteAdmin: (admin: OrgAdminDTO) => void;
}

const OrgAdminList: FC<Props> = ({
  orgName,
  fieldProps,
  handleDeleteAdmin,
}) => (
  <>
    {fieldProps.value.length === 0 ? (
      <Typography
        variant="body2"
        align="center"
      >{`${orgName} currently has no administrators`}</Typography>
    ) : (
      <List>
        {fieldProps.value.map((admin) => (
          <ListItem key={admin.adminId} disableGutters>
            <OrgAdminCard
              orgAdmin={admin}
              onDeleteClick={() => handleDeleteAdmin(admin)}
            />
          </ListItem>
        ))}
      </List>
    )}
  </>
);

export default OrgAdminList;
