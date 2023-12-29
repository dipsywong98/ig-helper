import React, {
  AppBar, Grid, Toolbar, Typography,
} from '@mui/material';
import Login from './Login';

export default function App() {
  return (
    <Grid
      sx={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      }}
      container
      flexDirection="column"
    >
      <Grid item>
        <AppBar position="static">
          <Toolbar>
            <Typography>IG Helper</Typography>
          </Toolbar>
        </AppBar>
      </Grid>
      <Grid item>
        {/* <p>{Array(1000).fill('abcd').join(' ')}</p> */}
        <Login />
      </Grid>
    </Grid>
  );
}
