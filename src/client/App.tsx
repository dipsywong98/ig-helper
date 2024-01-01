import React from 'react';
import Login from './Login';
import { useIgSession } from './IgSessionContext';
import Layout from './Layout';

export default function App() {
  const { isLoggedIn } = useIgSession();
  return (
    !isLoggedIn ? <Login /> : <Layout />
  );
}
