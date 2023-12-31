import React, { useState } from 'react';

import {
  Card, Typography, TextField, Checkbox, FormControlLabel, Grid, Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useQueries } from '@tanstack/react-query';
import { useIgSession } from './IgSessionContext';

export default function Login() {
  const { login, provideMFA } = useIgSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [needMfa, setNeedMfa] = useState(false);
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rmbMe, setRmbMe] = useState(true);
  const [trustThisDevice, setTrustThisDevice] = useState(true);

  const handleLogin = async () => {
    await login(username, password, rmbMe).then((result) => {
      if (result.mfa) {
        setNeedMfa(true);
      }
    }).catch((error) => {
      console.log(error);
      setErrorMessage(error.response.data.message);
    });
  };

  const handleMfa = async () => {
    await provideMFA(code, rmbMe, trustThisDevice).catch((error) => {
      setErrorMessage(error.response.data.message);
    });
  };

  const [loginQuery, mfaQuery] = useQueries({
    queries: [{
      queryKey: ['login'],
      queryFn: handleLogin,
      refetchOnWindowFocus: false,
      enabled: false,
    },
    {
      queryKey: ['mfa'],
      queryFn: handleMfa,
      refetchOnWindowFocus: false,
      enabled: false,
    }],
  });

  return (
    <Grid
      container
      sx={{
        width: '100%', height: '100%', verticalAlign: 'center',
      }}
    >
      <Card sx={{ m: 'auto', display: 'inline-block' }}>
        <Container sx={{ marginY: 1 }}>
          {
            !needMfa ? (
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h3" gutterBottom>
                    Login
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    label="username"
                    id="username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label="Keep logged in"
                    control={(
                      <Checkbox
                        checked={rmbMe}
                        onChange={({ target }) => setRmbMe(target.checked)}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <LoadingButton
                    loading={loginQuery.isFetching}
                    onClick={() => loginQuery.refetch()}
                    variant="contained"
                  >
                    Login
                  </LoadingButton>
                </Grid>
              </Grid>
            ) : (
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h3" gutterBottom>
                    MFA
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField label="code" value={code} onChange={({ target }) => setCode(target.value)} />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label="Trust this device"
                    control={(
                      <Checkbox
                        checked={trustThisDevice}
                        onChange={({ target }) => setTrustThisDevice(target.checked)}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <LoadingButton
                    loading={mfaQuery.isFetching}
                    onClick={() => mfaQuery.refetch()}
                    variant="contained"
                  >
                    Verify
                  </LoadingButton>
                </Grid>
              </Grid>
            )
          }
          <Typography color="error">{errorMessage}</Typography>
        </Container>
      </Card>
    </Grid>
  );
}
