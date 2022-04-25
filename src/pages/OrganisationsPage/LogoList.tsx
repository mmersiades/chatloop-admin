import { FC, useCallback, useEffect, useState } from 'react';
import { Orientation } from '../../@types/enums';
import { Organisation } from '../../@types/interfaces';
import {
  createStyles,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import EditRounded from '@material-ui/icons/EditRounded';

import logoPlaceholder from '../../assets/logo-placeholder.png';
import logomarkPlaceholder from '../../assets/logomark-placeholder.png';
import wordmarkPlaceholder from '../../assets/wordmark-placeholder.png';

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
  title: string;
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

  // -------------------------- Component functions ------------------------ //
  const styles = useStyles();

  const assembleItems = useCallback(() => {
    const items: ImageItem[] = [
      {
        src: logo || logoPlaceholder,
        orientation: logoOrientation,
        title: 'Logo',
      },
      {
        src: logomark || logomarkPlaceholder,
        orientation: logomarkOrientation,
        title: 'Logomark',
      },
      {
        src: wordmark || wordmarkPlaceholder,
        orientation: Orientation.landscape,
        title: 'Wordmark',
      },
    ];

    setItems(items);
  }, [logo, logomark, wordmark, logoOrientation, logomarkOrientation]);

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
          <ImageListItem key={item.title}>
            <img src={item.src} alt={item.title} />
            <ImageListItemBar
              title={item.title}
              classes={{
                root: styles.titleBar,
                title: styles.title,
              }}
              actionIcon={
                <IconButton aria-label={`star ${item.title}`}>
                  <EditRounded className={styles.title} />
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
