import React, { FC } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import chatloopTheme from "../assets/chatloopTheme";

const theme = createMuiTheme(chatloopTheme);

interface IRootProps {}

const Root: FC<IRootProps> = ({ children }): JSX.Element => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
};

export default Root;
