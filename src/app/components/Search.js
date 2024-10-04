"use client"
import React, { useState } from 'react';

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    startDate: '',
    endDate: '',
    employeeName: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await fetch(`/api/search?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = (clockIn, clockOut) => {
    if (!clockOut) return 'In progress';
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const durationHours = (end - start) / (1000 * 60 * 60);
    return durationHours.toFixed(2);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Search Time Entries</h2>
      <form onSubmit={handleSearch} className="space-y-4 mb-4">
        <div className="flex gap-2">
          <input
            type="date"
            name="startDate"
            value={searchParams.startDate}
            onChange={handleInputChange}
            className="flex-grow px-3 py-2 border rounded"
            required
          />
          <input
            type="date"
            name="endDate"
            value={searchParams.endDate}
            onChange={handleInputChange}
            className="flex-grow px-3 py-2 border rounded"
            required
          />
        </div>
        <input
          type="text"
          name="employeeName"
          value={searchParams.employeeName}
          onChange={handleInputChange}
          placeholder="Employee Name (optional)"
          className="w-full px-3 py-2 border rounded"
        />
        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Search
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {searchResults.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Search Results:</h3>
          <ul className="space-y-2">
            {searchResults.map((entry) => (
              <li key={entry._id} className="bg-gray-100 p-3 rounded">
                <p><strong>Employee:</strong> {entry.userName}</p>
                <p><strong>Clock In:</strong> {new Date(entry.clockIn).toLocaleString()}</p>
                <p><strong>Clock Out:</strong> {entry.clockOut ? new Date(entry.clockOut).toLocaleString() : 'Not clocked out'}</p>
                <p><strong>Duration:</strong> {calculateDuration(entry.clockIn, entry.clockOut)} hours</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;