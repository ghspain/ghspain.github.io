import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock heavy sections to avoid side effects and async fetches during App render
jest.mock('./components', () => {
  const React = require('react');
  return {
    MinimalFooter: () => React.createElement('div'),
    Navigation: () => React.createElement('div'),
    HeroSection: () => React.createElement('div'),
    CTASection: () => React.createElement('div'),
    CardsSection: () => React.createElement('div'),
    RiverSection: () => React.createElement('div'),
    NextEventsSection: () => React.createElement('h2', null, 'Próximos eventos'),
    PastEventsSection: () => React.createElement('div'),
  };
});

test('renders app shell with Upcoming events heading', () => {
  render(<App />);
  const heading = screen.getByText(/Próximos eventos/i);
  expect(heading).toBeInTheDocument();
});
