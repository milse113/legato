import React from "react";
import { useSelector } from "react-redux";
import {
  createMuiTheme,
  ThemeProvider,
  Button,
  CssBaseline,
} from "@material-ui/core";

import { RootState } from "./redux/redux";

export const Root = React.memo(() => {
  const themeState = useSelector((state: RootState) => state.theme);

  const theme = createMuiTheme({
    palette: {
      type: themeState.type,
      primary: themeState.primary,
      secondary: themeState.secondary,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button>hi</Button>
    </ThemeProvider>
  );
});
