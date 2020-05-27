import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
} from "@material-ui/core";

export const AddServerDialog = React.memo(
  (props: {
    serverAdded: (label: string, ip: string) => void;
    cancel: () => void;
    open: boolean;
  }) => {
    const [label, setLabel] = useState("");
    const [ip, setIP] = useState("");

    const onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(event.currentTarget.value);
    };

    const onIPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIP(event.currentTarget.value);
    };

    return (
      <Dialog open={props.open}>
        <DialogTitle>Add Server</DialogTitle>
        <DialogContent>
          <TextField placeholder="Label" onChange={onLabelChange} fullWidth />
          <TextField placeholder="IP" onChange={onIPChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.cancel}>Cancel</Button>
          <Button
            onClick={() => props.serverAdded(label, ip)}
            disabled={!ip || !label}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
