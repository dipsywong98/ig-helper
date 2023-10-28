import React, { useEffect, useRef, useState } from 'react';
import './Responder.css';
import { Box } from '@mui/material';
import domtoimage from 'dom-to-image';

interface Props {
  question: string
  response: string
  domScale?: number
}

export function Responder({ response, question, domScale: scale }: Props) {
  const domRef = useRef(null);
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    if (domRef.current !== null) {
      domtoimage.toPng(domRef.current).then((url) => {
        setDataUrl(url);
      });
    }
  }, [scale]);
  return (
    <Box sx={{ margin: 1, width: '225px', height: '119px' }}>
      <Box
        style={dataUrl !== '' ? { width: 0, height: 0, overflow: 'hidden' } : { }}
      >
        <Box
          ref={domRef}
          sx={{
            borderRadius: `${15 * scale}px`,
            width: `${450 * scale}px`,
            overflow: 'hidden',
            fontFamily: '"Roboto", "Noto Sans", "Helvetica", "Arial", sans-serif',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              padding: `${25 * scale}px ${39 * scale}px`,
              backgroundColor: '#262626',
              fontSize: `${24 * scale}px`,
              color: '#ffffff',
            }}
          >
            {question}
          </Box>
          <Box sx={{
            backgroundColor: '#ffffff',
            color: '#292929',
            padding: `${40 * scale}px ${35 * scale}px`,
            fontSize: `${32 * scale}px`,
          }}
          >
            {response}
          </Box>
        </Box>
      </Box>
      {dataUrl && <img alt="response" src={dataUrl} className="respond-img" />}
    </Box>
  );
}

Responder.defaultProps = {
  domScale: 0.5,
};
