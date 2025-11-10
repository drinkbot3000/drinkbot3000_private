import { render, screen } from '@testing-library/react';
import App from './App';

describe('DrinkBot3000 App', () => {
  test('renders age verification screen initially', () => {
    render(<App />);
    // Look for age verification text
    const ageText = screen.getByText(/are you 21 or older/i);
    expect(ageText).toBeInTheDocument();
  });

  test('renders app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/DrinkBot3000/i);
    expect(titleElement).toBeInTheDocument();
  });
});
