import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('shows age verification screen initially', () => {
    render(<App />);
    // Age verification should be shown first
    const ageText = screen.getByText(/legal drinking age/i);
    expect(ageText).toBeInTheDocument();
  });

  test('displays age verification heading', () => {
    render(<App />);
    // Age verification screen should have a heading
    const heading = screen.getByText(/age verification required/i);
    expect(heading).toBeInTheDocument();
  });
});
