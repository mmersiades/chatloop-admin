import React, { FC } from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { useOrganisations } from '../../contexts/organisationsContext';
import { OrgAdminDTO } from '../../@types/interfaces';
import {
  CANCEL,
  REMOVE,
  REMOVE_ORG_ADMIN_TITLE,
} from '../../config/textConstants';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    highlightSpan: {
      color: palette.secondary.main,
    },
  })
);

interface Props extends DialogProps {
  handleCancel: () => void;
  handleRemove: () => void;
  orgAdmin: OrgAdminDTO;
}

const RemoveOrgAdminDialog: FC<Props> = ({
  orgAdmin,
  handleCancel,
  handleRemove,
  open,
  onClose,
  ...dialogueProps
}) => {
  // -------------------------- Hooks -------------------------------------- //
  const { selectedOrganisation } = useOrganisations();

  // -------------------------- Component functions ------------------------ //
  const classes = useStyles();

  // -------------------------- Render ------------------------------------- //
  return (
    <Dialog open={open} onClose={onClose} {...dialogueProps}>
      <DialogTitle>{REMOVE_ORG_ADMIN_TITLE}</DialogTitle>
      <DialogContent>
        <Typography paragraph>
          Are you sure you want to delete{' '}
          <span className={classes.highlightSpan}>{orgAdmin.name}</span> from{' '}
          <span className={classes.highlightSpan}>
            {selectedOrganisation?.shortName ||
              selectedOrganisation?.officialName}
          </span>
          ?
        </Typography>
        <Typography
          paragraph
        >{`This will also delete ${orgAdmin.name}'s Chatloop user account.`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button aria-label="Cancel button" onClick={handleCancel}>
          {CANCEL}
        </Button>
        <Button
          aria-label="Confirm remove org admin button"
          color="secondary"
          variant="contained"
          onClick={handleRemove}
        >
          {REMOVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveOrgAdminDialog;
