import { FC, useCallback, useEffect, useState } from 'react';
import { LogoType, Orientation } from '../../@types/enums';
import { Organisation } from '../../@types/interfaces';
import {
  createStyles,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { capitalize } from 'lodash';

import logoPlaceholder from '../../assets/logo-placeholder.png';
import logomarkPlaceholder from '../../assets/logomark-placeholder.png';
import wordmarkPlaceholder from '../../assets/wordmark-placeholder.png';
import { useOrganisations } from '../../contexts/organisationsContext';
import { DeleteRounded } from '@material-ui/icons';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    container: {
      height: 300,
      width: '100%',
      padding: spacing(1.5),
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: palette.background.paper,
    },
    imageList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: palette.common.white,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.3) 100%)',
    },
    image: {
      cursor: 'pointer',
    },
  })
);

interface Props
  extends Pick<
    Organisation,
    | 'id'
    | 'logo'
    | 'logoOrientation'
    | 'logomark'
    | 'logomarkOrientation'
    | 'wordmark'
  > {}

interface ImageItem {
  src: string;
  type: LogoType;
  orientation: Orientation | null;
}

const LogoList: FC<Props> = ({
  id,
  logo,
  logomark,
  logomarkOrientation,
  logoOrientation,
  wordmark,
}) => {
  // -------------------------- Component state ---------------------------- //
  const [items, setItems] = useState<ImageItem[]>([]);
  // -------------------------- 3rd party hooks ---------------------------- //

  // -------------------------- Hooks -------------------------------------- //
  const { openLogoDialog, deleteLogo, deleting } = useOrganisations();

  // -------------------------- Component functions ------------------------ //
  const styles = useStyles();

  const assembleItems = useCallback(() => {
    const items: ImageItem[] = [
      {
        src: logo || logoPlaceholder,
        orientation: logoOrientation,
        type: LogoType.logo,
      },
      {
        src: logomark || logomarkPlaceholder,
        orientation: logomarkOrientation,
        type: LogoType.logomark,
      },
      {
        src: wordmark || wordmarkPlaceholder,
        orientation: Orientation.landscape,
        type: LogoType.wordmark,
      },
    ];

    setItems(items);
  }, [logo, logomark, wordmark, logoOrientation, logomarkOrientation]);

  const handleClick = (item: ImageItem) =>
    openLogoDialog &&
    openLogoDialog({
      open: true,
      src: item.src,
      type: item.type,
      orgId: id,
      orientation: item.orientation,
    });

  const handleDelete = (item: ImageItem) => {
    deleteLogo && deleteLogo({ orgId: id, type: item.type });
  };

  // -------------------------- Effects ------------------------------------ //
  useEffect(() => {
    assembleItems();
  }, [
    logo,
    logomark,
    wordmark,
    logoOrientation,
    logomarkOrientation,
    assembleItems,
  ]);

  // -------------------------- Render ------------------------------------- //
  return (
    <div className={styles.container}>
      <ImageList className={styles.imageList} cols={2.5}>
        {items.map((item) => (
          <ImageListItem key={item.type}>
            <img
              src={item.src}
              alt={capitalize(item.type)}
              onClick={() => handleClick(item)}
              className={styles.image}
            />
            <ImageListItemBar
              title={capitalize(item.type)}
              classes={{
                root: styles.titleBar,
                title: styles.title,
              }}
              actionIcon={
                <IconButton
                  aria-label={`edit ${item.type.toLowerCase()}`}
                  onClick={() => handleDelete(item)}
                  disabled={deleting}
                >
                  <DeleteRounded className={styles.title} />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default LogoList;
