import { FC, useRef, useState } from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useOrganisations } from '../../contexts/organisationsContext';
import { LogoType, Orientation } from '../../@types/enums';
import { resizeImage } from '../../helpers/resizeImage';
import organisationsService from '../../services/organisationsService';
import { dataURItoBlob } from '../../helpers/dataURItoBlob';
import { getImageOrientation } from '../../helpers/getImageOrientation';

import logoPlaceholder from '../../assets/logo-placeholder.png';
import logomarkPlaceholder from '../../assets/logomark-placeholder.png';
import wordmarkPlaceholder from '../../assets/wordmark-placeholder.png';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    image: {
      maxWidth: 500,
      maxHeight: 500,
      textAlign: 'center',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.5,
      },
    },
    dialogContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      display: 'none',
    },
  })
);

export interface LogoDialogProps extends DialogProps {
  src: string;
  type: LogoType;
  orgId: number;
  orientation: Orientation | null;
}

const LogoDialog: FC<LogoDialogProps> = ({
  open,
  src,
  type,
  orgId,
  orientation,
  ...dialogProps
}) => {
  // -------------------------- Component state ---------------------------- //
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(src);

  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const { closeLogoDialog, updateLogo, updating } = useOrganisations();

  // -------------------------- Component functions ------------------------ //
  const styles = useStyles();

  const getText = () => {
    switch (type) {
      case LogoType.logo:
        return "A logo is usually an image that combines the organisation's logomark and wordmark";
      case LogoType.logomark:
        return 'A logomark is usually a some kind of graphic, without words, that represents the organisation';
      case LogoType.wordmark:
        return 'A wordmark is the stylised organisation name';
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const readFile = (file: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onSelectFile = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl: string = (await readFile(file)) as string;

      // Resizes if too big
      imageDataUrl = await resizeImage(imageDataUrl);

      setImageUrl(imageDataUrl);
    }
  };

  const handleSubmit = async () => {
    if (
      ![logoPlaceholder, logomarkPlaceholder, wordmarkPlaceholder].includes(
        imageUrl
      ) &&
      updateLogo
    ) {
      const newOrientation = await getImageOrientation(imageUrl);

      const newFile = new File([dataURItoBlob(imageUrl)], 'filename.png', {
        type: 'image/png',
      });

      const success = await updateLogo({
        orgId,
        type,
        files: [newFile],
        orientation: newOrientation,
      });

      success && closeLogoDialog && closeLogoDialog();
    }
  };

  console.log(imageUrl);

  // -------------------------- Effects ------------------------------------ //

  // -------------------------- Render ------------------------------------- //
  return (
    <Dialog
      open={open}
      onClose={closeLogoDialog}
      aria-labelledby="form-dialog-title"
      {...dialogProps}
    >
      <DialogTitle id="form-dialog-title">{`Edit ${type.toLowerCase()}`}</DialogTitle>
      <DialogContent classes={{ root: styles.dialogContent }}>
        <DialogContentText>{getText()}</DialogContentText>
        <img
          src={imageUrl}
          alt={type}
          className={styles.image}
          onClick={handleClick}
          role="button"
        />
        <input
          type="file"
          ref={inputRef}
          className={styles.input}
          onChange={onSelectFile}
          accept="image/*"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeLogoDialog} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
          disabled={
            [
              logoPlaceholder,
              logomarkPlaceholder,
              wordmarkPlaceholder,
            ].includes(imageUrl) || updating
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoDialog;
