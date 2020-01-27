import React, { FC } from "react";
import { Router } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import chatloopTheme from "../assets/chatloopTheme";
import history from "../helpers/getBrowserHistory";

const theme = createMuiTheme(chatloopTheme);

interface IRootProps {
  children: Array<JSX.Element> | JSX.Element;
}

const Root: FC<IRootProps> = ({ children }: IRootProps): JSX.Element => {
  return (
    <>
      <CssBaseline />
      <Router history={history}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Router>
    </>
  );
};

export default Root;
