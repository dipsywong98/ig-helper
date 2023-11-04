import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { throttle } from 'lodash';
import { QAStory } from '../common/QAStory';
import { Stories } from './Stories';
import { sampleQAStories } from '../common/sampleQAStories';

function App(): JSX.Element {
  const [stories, setStories] = useState<QAStory[] | null>(sampleQAStories);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('Please log in');
  const [uploading, setUploading] = useState(false);
  const upload = useCallback((file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('username', username);
    formData.append('password', password);
    axios.post('/api/stories/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data }) => {
        alert(data.message);
      })
      .catch((e) => {
        console.log(e);
        alert(e.response?.data?.message ?? 'Error connecting to ig-helper server');
      })
      .finally(() => {
        setUploading(false);
      });
  }, [username, password]);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles);
    if (acceptedFiles.length > 0) {
      upload(acceptedFiles[0]);
    }
  }, [upload]);
  const handlePasteStory: React.ClipboardEventHandler<HTMLInputElement> = useCallback((evt) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dT = evt.clipboardData ?? window.clipboardData;
    console.log(dT);
    if (dT.files?.length > 0) {
      console.log(dT.files[0]);
      upload(dT.files[0]);
    }
  }, [upload]);
  // useEffect(() => {
  //   const fn = throttle((evt: ClipboardEvent) => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     const dT = evt.clipboardData ?? window.clipboardData;
  //     console.log(dT);
  //     if (dT.files?.length > 0) {
  //       console.log(dT.files[0]);
  //       upload(dT.files[0]);
  //     }
  //   });
  //   document.addEventListener('paste', fn);
  //   return () => {
  //     document.removeEventListener('paste', fn);
  //   };
  // }, [upload]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });
  const handleLogin = () => {
    setMessage('loading... it might take a minute...');
    axios.post(
      '/api/stories',
      { username, password, otp },
    )
      .then(({ data }) => {
        setStories(data);
        setMessage('');
      })
      .catch((e) => {
        console.log(e);
        setMessage(e.response?.data?.message ?? 'Error connecting to ig-helper server');
      });
  };
  return (
    <div>
      <Typography variant="h3">IG Helper - Stories QA Extractor</Typography>
      <div style={{ display: 'flex' }}>
        <div>
          <p>
            username:
            {' '}
            <input value={username} onChange={({ target }) => { setUsername(target.value); }} />
          </p>
          <p>
            password:
            {' '}
            <input type="password" value={password} onChange={({ target }) => { setPassword(target.value); }} />
          </p>
          <p>
            otp:
            {' '}
            <input value={otp} onChange={({ target }) => { setOtp(target.value); }} />
          </p>
          <p>
            otp is 6 digit number from your authenticator app (e.g. google Authenticator).
            Leave blank if you didnt enable 2FA. Currently not supporting SMS.
          </p>
          <p>
            Known issue: drag and drop to figma is not working for firefox
          </p>
          <p><button type="button" onClick={handleLogin}>login</button></p>
          {message !== '' && (
            <p>
              Message:
              {message}
            </p>
          )}
        </div>
        <div style={{ border: 'red 4px dashed', width: '300px', height: '300px' }} {...getRootProps()}>
          <input {...getInputProps()} />
          {
            // eslint-disable-next-line no-nested-ternary
            uploading ? <p>Uploading</p>
              : isDragActive
                ? <p>Drop the files here to upload as story...</p>
                : <p>Drag 'n' drop some files here, or click to select files, to upload story</p>
          }
          <p>
            Or paste here:
            {' '}
            <input onPaste={handlePasteStory} onClick={(e) => { e.stopPropagation(); }} />
          </p>
        </div>
      </div>
      {
        stories === null ? 'please log in' : <Stories stories={stories} />
      }
    </div>
  );
}

export default App;
