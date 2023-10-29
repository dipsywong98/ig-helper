import React, { useEffect, useRef, useState } from 'react';
import './Responder.css';
import { Box } from '@mui/material';
import domtoimage from 'dom-to-image-more';

// declare module 'dom-to-image-more' {
//   import domToImage = require('dom-to-image-more');

//   export = domToImage;
// }

interface Props {
  question: string
  response: string
  domScale?: number
  imageScale?: number
}

export function Responder({
  response, question, domScale: scale, imageScale,
}: Props) {
  const domRef = useRef(null);
  const displayRef = useRef(null);
  const rootRef = useRef(null);
  const [dataUrl, setDataUrl] = useState('');
  // useEffect(() => {
  //   if (domRef.current !== null) {
  //     domtoimage.toPng(domRef.current).then((url) => {
  //       setDataUrl(url);
  //     });
  //   }
  // }, [scale]);
  const domBubble = (ref?: typeof domRef) => (
    <Box
      ref={ref}
      sx={{
        borderRadius: '30px',
        border: 'black 1px solid',
        boxSizing: 'border-box',
        width: '840px',
        overflow: 'hidden',
        fontFamily: '"Roboto", "Noto Sans", "Helvetica", "Arial", sans-serif',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          padding: '50px 60px',
          backgroundColor: '#262626',
          fontSize: '42px',
          color: '#ffffff',
          overflowWrap: 'break-word',
        }}
      >
        {question}
      </Box>
      <Box sx={{
        backgroundColor: '#ffffff',
        color: '#292929',
        padding: response.length >= 20 ? '60px 52px' : '50px 52px',
        fontSize: response.length >= 20 ? '48px' : '56px',
        overflowWrap: 'break-word',
        fontWeight: 'bold',
      }}
      >
        {response.split('\n').map((w) => (<div key={w}>{w}</div>))}
      </Box>
    </Box>
  );
  useEffect(() => {
    if (rootRef.current !== null && displayRef.current !== null) {
      rootRef.current.style.height = `${displayRef.current.clientHeight * imageScale}px`;
      rootRef.current.style.width = `${840 * imageScale}px`;
    }
  }, [imageScale]);
  return (
    <Box
      sx={{
        margin: 1,
        // width: '225px',
        position: 'relative',
      }}
      ref={rootRef}
    >
      <Box
        sx={{
          width: 0, height: 0, overflow: 'hidden', position: 'absolute',
        }}
      >
        {domBubble(domRef)}
      </Box>
      <Box ref={displayRef} sx={{ scale: `${imageScale}`, transformOrigin: 'top left' }}>
        {dataUrl
          ? (
            <img alt="response" src={dataUrl} />
          ) : domBubble()}
      </Box>
    </Box>
  );
}

Responder.defaultProps = {
  domScale: 1,
  imageScale: 0.3,
};
