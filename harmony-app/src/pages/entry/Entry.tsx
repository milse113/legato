import React, { useState } from "react";
import {
  makeStyles,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { AddServerDialog } from "./AddServerDialog";

const entryStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `radial-gradient(circle at 50% 10%,
      rgb(43, 38, 57),
      rgb(38, 35, 49) 70.71%)`,
  },
  entryBody: {
    width: "60%",
    padding: theme.spacing(2),
    textAlign: "center",
  },
  serverListItem: {
    padding: theme.spacing(2),
  },
  serverList: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
  },
  continueButton: {
    marginTop: theme.spacing(3),
  },
}));

interface IServerList {
  [key: string]: {
    ip: string;
  };
}

const defaultServers: IServerList = {
  official: {
    ip: "127.0.0.1:2289",
  },
  KDE: {
    ip: "harmony.kde.org:2289",
  },
};

export const Entry = React.memo(() => {
  const classes = entryStyles();
  const i18n = useTranslation(["entry"]);
  const [addingServer, setAddingServer] = useState(false);
  const [selectedServer, setSelectedServer] = useState("");

  const onServerAdded = (label: string, ip: string) => {};

  return (
    <div className={classes.root}>
      <Paper className={classes.entryBody} elevation={5}>
        <Typography variant="h6" align="center">
          {i18n.t("entry:select-instance")}
        </Typography>
        <List className={classes.serverList}>
          {Object.keys(defaultServers).map((name) => {
            return (
              <ListItem
                button
                className={classes.serverListItem}
                key={name}
                selected={selectedServer === name}
                onClick={() => setSelectedServer(name)}
              >
                <ListItemText
                  primary={name}
                  secondary={defaultServers[name].ip}
                />
              </ListItem>
            );
          })}
          <ListItem button>
            <Typography variant="h6" align="center">
              +
            </Typography>
          </ListItem>
        </List>
        <Button
          disabled={!selectedServer}
          variant="contained"
          color="primary"
          className={classes.continueButton}
        >
          Continue
        </Button>
      </Paper>
      <AddServerDialog
        open={addingServer}
        serverAdded={onServerAdded}
        cancel={() => setAddingServer(false)}
      />
    </div>
  );
});
