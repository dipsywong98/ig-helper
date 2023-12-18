import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('App', () => {
  it('can mount', () => {
    render(<App />);
    expect(screen.getByText('Sample').textContent).toBe('Sample');
  });
});
