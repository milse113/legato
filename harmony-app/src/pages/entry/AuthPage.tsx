import React from "react";
import { Grid, TextField, Paper, makeStyles } from "@material-ui/core";

const authPageStyles = makeStyles((theme) => ({
  option: {
    padding: theme.spacing(2),
    "& *": {
      marginBottom: theme.spacing(1),
    },
  },
}));

export const AuthPage = React.memo(() => {
  const classes = authPageStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Paper className={classes.option}>
          <TextField variant="outlined" label="Email" fullWidth />
          <TextField variant="outlined" label="Password" fullWidth />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.option}>
          <TextField variant="outlined" label="Email" fullWidth />
          <TextField variant="outlined" label="Password" fullWidth />
        </Paper>
      </Grid>
    </Grid>
  );
});
