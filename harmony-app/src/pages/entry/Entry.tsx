import React, { useState } from "react";
import {
  makeStyles,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
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
    padding: theme.spacing(2),
    textAlign: "center",
  },
  serverListItem: {
    padding: theme.spacing(2),
  },
  serverList: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    maxHeight: "500px",
    overflowY: "auto",
  },
  serverListHeader: {
    marginBottom: theme.spacing(1),
    textAlign: "right",
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
  const [servers, setServers] = useState(defaultServers);
  const [addingServer, setAddingServer] = useState(false);
  const [selectedServer, setSelectedServer] = useState("");

  const onServerAdded = (label: string, ip: string) => {
    setServers({
      ...servers,
      [label]: {
        ip,
      },
    });
    setAddingServer(false);
  };

  const removeServer = (label: string) => {
    const { [label]: _, ...remaining } = servers;
    setServers(remaining);
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.entryBody} elevation={5}>
          <Typography variant="h6" align="center">
            {i18n.t("entry:select-instance")}
          </Typography>
          <div className={classes.serverListHeader}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAddingServer(true)}
            >
              Add Server
            </Button>
          </div>
          <List className={classes.serverList}>
            {Object.keys(servers).map((name) => {
              return (
                <ListItem
                  button
                  className={classes.serverListItem}
                  key={name}
                  selected={selectedServer === name}
                  onClick={() => setSelectedServer(name)}
                >
                  <ListItemText primary={name} secondary={servers[name].ip} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => removeServer(name)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
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
      </Container>
      <AddServerDialog
        open={addingServer}
        serverAdded={onServerAdded}
        cancel={() => setAddingServer(false)}
      />
    </div>
  );
});
