import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components', () => ({
  Navigation: () => <nav>Navigation</nav>,
  HeroSection: () => <h1>GitHub Community Spain</h1>,
  CardsSection: () => <section>Cards</section>,
  CTASection: () => <section>CTA</section>,
  TimelineSection: () => <section><h2>Ultimos eventos</h2></section>,
  RiverSection: () => <section><h2>Quienes somos</h2></section>,
  MinimalFooter: () => <footer>Footer</footer>
}));

test('renders the main homepage shell', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /github community spain/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /ultimos eventos/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /quienes somos/i })).toBeInTheDocument();
  expect(screen.getByText('Footer')).toBeInTheDocument();
});
