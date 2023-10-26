import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

function App(): JSX.Element {
  const [str, setStr] = useState('loading');
  const [count, setCount] = useState(0);
  useEffect(() => {
    axios.get<string>('/api/ping').then(({ data }) => setStr(data)).catch((err: Error) => setStr(err.message));
  }, []);

  return (
    <div>
      <h1>Sample</h1>
      <div>{str}</div>
      <button type="button" onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}

export default App;
