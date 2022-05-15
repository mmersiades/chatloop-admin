import { FC } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  CardHeader,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import { DeleteRounded } from '@material-ui/icons';

import { OrgAdminDTO } from '../../@types/interfaces';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: spacing(1.5),
    },
    root: {
      width: '100%',
    },
  })
);

interface Props {
  orgAdmin: OrgAdminDTO;
  onDeleteClick: () => void;
}

const OrgAdminCard: FC<Props> = ({ orgAdmin, onDeleteClick }) => {
  // -------------------------- Component functions ------------------------ //
  const styles = useStyles();

  // -------------------------- Render ------------------------------------- //
  const Title = () => (
    <div className={styles.titleContainer}>
      <Typography variant="h6">{orgAdmin.name}</Typography>
      <IconButton
        aria-label={`remove ${orgAdmin.name}`}
        onClick={onDeleteClick}
      >
        <DeleteRounded />
      </IconButton>
    </div>
  );
  return (
    <Card classes={{ root: styles.root }}>
      <CardHeader component={Title} />
      <CardContent>
        {orgAdmin.email && <Typography>{orgAdmin.email}</Typography>}
        {orgAdmin.phone && <Typography>{orgAdmin.phone}</Typography>}
      </CardContent>
    </Card>
  );
};

export default OrgAdminCard;
