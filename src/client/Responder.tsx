import React, { useEffect, useRef, useState } from 'react';
import './Responder.css';
import { Box } from '@mui/material';
import domtoimage from 'dom-to-image';

interface Props {
  question: string
  response: string
}

export function Responder({ response, question }: Props) {
  const domRef = useRef(null);
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    if (domRef.current !== null) {
      domtoimage.toPng(domRef.current).then((url) => {
        setDataUrl(url);
      });
    }
  }, []);
  return (
    <Box sx={{ margin: 1 }}>
      <Box sx={{ maxWidth: '0px', maxHeight: '0px', overflow: 'hidden' }}>
        <Box ref={domRef} className="responder">
          <Box className="responder-question">{question}</Box>
          <Box className="responder-response">{response}</Box>
        </Box>
      </Box>
      <img alt="response" src={dataUrl} />
    </Box>
  );
}
