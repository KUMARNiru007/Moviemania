
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../app/page';
import { ThemeProvider } from '../context/ThemeContext';
import '@testing-library/jest-dom';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('Home Page', () => {
  it('allows filling the IMDb ID form', () => {
    render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    const input = screen.getByPlaceholderText(/Enter IMDb ID/i);
    fireEvent.change(input, { target: { value: 'tt1234567' } });
    expect(input).toHaveValue('tt1234567');
  });
});
