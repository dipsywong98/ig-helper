import React, {
  useEffect, useRef, useState,
} from 'react';
import './Responder.css';
import { Box } from '@mui/material';
import domtoimage from 'dom-to-image';
// import Worker from './dom2img.worker?worker';

// declare module 'dom-to-image-more' {
//   import domToImage = require('dom-to-image-more');

//   export = domToImage;
// }

interface Props {
  question: string
  response: string
  imageScale?: number
}

export function Responder({
  response, question, imageScale,
}: Props) {
  const domRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    if (domRef.current !== null) {
      domtoimage.toSvg(domRef.current, { width: 840 }).then((url) => {
        setDataUrl(url);
      });
    }
  }, []);
  const domBubble = (ref?: typeof domRef) => (
    <Box
      ref={ref}
      sx={{
        borderRadius: '30px',
        border: 'black 1px solid',
        boxSizing: 'border-box',
        width: '840px',
        overflow: 'hidden',
        fontFamily: '"Helvetica", sans-serif',
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
        padding: response.length >= 20 ? '60px 52px' : '50px 48px',
        fontSize: response.length >= 20 ? '48px' : '56px',
        overflowWrap: 'break-word',
        // fontWeight: 600,
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
  imageScale: 0.3,
};
