import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaycheckCalculator from '../PaycheckCalculator';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('PaycheckCalculator', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear();
  });

  it('renders correctly and calculates paycheck', async () => {
    localStorageMock.getItem.mockReturnValue('mock-token');

    const mockPaycheckData = {
      regularHours: 40,
      overtimeHours: 5,
      regularPay: 800,
      overtimePay: 150,
      totalPay: 950
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaycheckData,
    });

    render(<PaycheckCalculator />);

    // Check if inputs and button are rendered
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Calculate Paycheck' })).toBeInTheDocument();

    // Fill in dates and click calculate
    fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText('End Date'), { target: { value: '2023-01-15' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate Paycheck' }));

    // Check loading state
    expect(screen.getByText('Calculating...')).toBeInTheDocument();

    // Wait for results to be displayed
    await waitFor(() => {
      expect(screen.getByText('Paycheck Summary')).toBeInTheDocument();
      expect(screen.getByText('Regular Hours:')).toBeInTheDocument();
      expect(screen.getByText('40.00')).toBeInTheDocument();
      expect(screen.getByText('Overtime Hours:')).toBeInTheDocument();
      expect(screen.getByText('5.00')).toBeInTheDocument();
      expect(screen.getByText('Regular Pay:')).toBeInTheDocument();
      expect(screen.getByText('$800.00')).toBeInTheDocument();
      expect(screen.getByText('Overtime Pay:')).toBeInTheDocument();
      expect(screen.getByText('$150.00')).toBeInTheDocument();
      expect(screen.getByText('Total Pay: $950.00')).toBeInTheDocument();
    });

    // Verify API call
    expect(fetch).toHaveBeenCalledWith(
      '/api/paycheck?startDate=2023-01-01&endDate=2023-01-15',
      expect.objectContaining({
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      })
    );
  });

  it('displays error message on API failure', async () => {
    localStorageMock.getItem.mockReturnValue('mock-token');

    fetch.mockRejectedValueOnce(new Error('API error'));

    render(<PaycheckCalculator />);

    fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText('End Date'), { target: { value: '2023-01-15' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate Paycheck' }));

    await waitFor(() => {
      expect(screen.getByText('An error occurred while calculating your paycheck. Please try again.')).toBeInTheDocument();
    });
  });
});