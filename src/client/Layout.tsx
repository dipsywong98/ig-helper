import React, {
  AppBar, Box, Button, Grid, Toolbar, Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Login from './Login';
import { useIgSession } from './IgSessionContext';

export default function Layout() {
  const { logout, getMe } = useIgSession();
  const meQuery = useQuery({ queryKey: ['me'], queryFn: getMe });
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
            <Typography>
              IG Helper -
              {' '}
              {meQuery?.data?.full_name}
            </Typography>
          </Toolbar>
        </AppBar>
      </Grid>
      <Grid item>
        logged in
        <Button onClick={logout}>log out</Button>
      </Grid>
    </Grid>
  );
}
