/**
 * @module assets
 */

/** */
import getTextDirection from '../helpers/getTextDirection';

/**
 * Chatloop Navy, used as:
 * * palette.primary.main */
export const navy = '#3b6180';

/** Chatloop Dark Navy, used as:
 * * palette.common.black
 * * palette.text.main (at 900)
 * * the basis for the grey tones
 * * palette.grey[800]
 */
export const darkNavy = '#3c4a52';

/**
 * Chatloop Mid-Blue, used as:
 * * palette.secondary.main
 */
export const midBlue = '#43a5e0';

/**
 * Chatloop Pink, used as:
 * * palette.error.main
 */
const errorPink = '#c51162';

/**
 * Data for a [material-ui] theme override, for theme customisation. <br>
 * See [Theming](https://material-ui.com/customization/theming/). <br>
 * To be passed to `createTheme()`.
 */
const chatloopTheme = {
  direction: getTextDirection(),
  overrides: {
    MuiSnackbarContent: {
      root: {
        backgroundColor: darkNavy,
      },
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: ['"Lato"', '"Helvetica"', '"Arial"', '"sans-serif"'].join(', '),
    h2: {
      fontFamily: [
        '"Lato-Bold"',
        '"Lato"',
        '"Helvetica"',
        '"Arial"',
        '"sans-serif"',
      ].join(', '),
      fontWeight: 700,
    },
    h3: {
      fontFamily: [
        '"Lato-Blackitalic"',
        '"Lato"',
        '"Helvetica"',
        '"Arial"',
        '"sans-serif"',
      ].join(', '),
      fontWeight: 600,
      fontStyle: 'italic',
    },
    h4: {
      fontFamily: [
        '"Lato-Bold"',
        '"Lato"',
        '"Helvetica"',
        '"Arial"',
        '"sans-serif"',
      ].join(', '),
      fontWeight: 500,
    },
    h5: {
      fontFamily: [
        '"Lato-BlackItalic"',
        '"Lato"',
        '"Helvetica"',
        '"Arial"',
        '"sans-serif"',
      ].join(', '),
      fontWeight: 600,
      fontStyle: 'italic',
    },
    h6: {
      fontFamily: [
        '"Lato-Bold"',
        '"Lato"',
        '"Helvetica"',
        '"Arial"',
        '"sans-serif"',
      ].join(', '),
      fontWeight: 500,
    },
    caption: {
      fontFamily: [
        '"Lato-Light"',
        '"Lato"',
        '"Helvetica"',
        '"Arial"',
        '"sans-serif"',
      ].join(', '),
    },
    overline: {
      fontFamily: [
        '"Lato-Semibold"',
        '"Lato"',
        '"Helvetica"',
        '"Arial"',
        '"sans-serif"',
      ].join(', '),
    },
  },
  palette: {
    common: {
      black: darkNavy,
      white: '#fff',
    },
    primary: {
      light: '#6a8eaf',
      main: navy,
      dark: darkNavy,
      contrastText: '#fff',
    },
    secondary: {
      main: midBlue,
      contrastText: '#fff',
    },
    error: {
      light: '#fd558f',
      main: errorPink,
      dark: '#8e0038',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(43, 53, 99, 1)', // #2B353B, which is darkNavy at 900
      secondary: 'rgba(60, 74, 82, 0.87)',
      disabled: 'rgba(60, 74, 82, 0.38)',
      hint: 'rgba(60, 74, 82, 0.54)',
    },
    background: {
      paper: '#fff',
      default: '#fff',
    },
    action: {
      active: 'rgba(67, 165, 224, 1)', //Alpha used to be 0.54, changed to 1 as an experiment to make icons bolder.
      hover: 'rgba(67, 165, 224, 0.08)',
      selected: 'rgba(67, 165, 224, 0.14)',
      disabled: 'rgba(67, 165, 224, 0.26)',
      disabledBackground: 'rgba(67, 165, 224, 0.12)',
    },
    grey: {
      50: '#eeeff1',
      100: '#d2d9dd',
      200: '#b4c0c7',
      300: '#95a7b1',
      400: '#7d939f',
      500: '#66808f',
      600: '#5a717e',
      700: '#4a5d67',
      800: darkNavy,
      900: '#2b353b',
    },
  },
};

export default chatloopTheme;
