// app/components/Search.js
"use client"

import React, { useState } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/search?term=${searchTerm}`, {
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

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Search</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for users or time entries"
          className="flex-grow px-3 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Search
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {searchResults.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Search Results:</h3>
          <ul className="space-y-2">
            {searchResults.map((result) => (
              <li key={result._id} className="bg-gray-100 p-3 rounded">
                <p><strong>Name:</strong> {result.name}</p>
                <p><strong>Email:</strong> {result.email}</p>
                {result.clockIn && <p><strong>Clock In:</strong> {new Date(result.clockIn).toLocaleString()}</p>}
                {result.clockOut && <p><strong>Clock Out:</strong> {new Date(result.clockOut).toLocaleString()}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;