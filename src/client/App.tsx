import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import {
  Box, Button, Modal, Typography,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import LoadingButton from '@mui/lab/LoadingButton';
import { dataURLtoFile, downloadFile, EImageType } from 'image-conversion';
import { QAStory } from '../common/QAStory';
import { Stories } from './Stories';
import { sampleQAStories } from '../common/sampleQAStories';
import { fileToDataUrl, convertToJPG } from './fileToDataUrl';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App(): JSX.Element {
  const [stories, setStories] = useState<QAStory[] | null>(sampleQAStories);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('Please log in');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  useEffect(() => {
    if (selectedFile !== null) {
      fileToDataUrl(selectedFile).then((url) => {
        setSelectedFileUrl(url);
      });
    } else {
      setSelectedFileUrl('');
    }
  }, [selectedFile]);
  const handleFileSelect = useCallback((file: File) => {
    const fileType = file.type;
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!validImageTypes.includes(fileType)) {
      alert('selected file type is not image');
    } else {
      setSelectedFile(file);
    }
  }, []);
  const upload = useCallback(() => {
    setUploading(true);
    const formData = new FormData();
    dataURLtoFile(selectedFileUrl)
      .then(async (file) => {
        console.log(file);
        formData.append('image', file);
        formData.append('username', username);
        formData.append('password', password);
        return axios.post('/api/stories/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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
        setSelectedFile(null);
      });
  }, [username, password, selectedFileUrl]);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  }, [handleFileSelect]);
  const handlePasteStory: React.ClipboardEventHandler<HTMLInputElement> = useCallback((evt) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dT = evt.clipboardData ?? window.clipboardData;
    if (dT.files?.length > 0) {
      handleFileSelect(dT.files[0]);
    }
  }, [handleFileSelect]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxFiles: 1, accept: { 'image/*': [] }, onDropRejected: (e) => { console.log(e); alert(e[0]?.errors?.[0]?.message ?? 'Rejected'); },
  });
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
      <Modal
        open={selectedFile !== null || uploading}
        onClose={() => { setSelectedFile(null); }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload Story - Preview
          </Typography>
          <Box sx={{
            backgroundImage: `url('${selectedFileUrl}')`,
            width: '360px',
            height: '640px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            backgroundSize: 'contain',
            border: '1px solid black',
            mb: 1,
          }}
          />
          <Box>
            <Button disabled={uploading} sx={{ mr: 1 }} variant="text" onClick={() => { setSelectedFile(null); }}>Cancel</Button>
            <LoadingButton variant="contained" color="primary" onClick={upload} loading={uploading}>Upload</LoadingButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
