"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Demo = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Tyme Keepa Demo</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-6xl font-bold text-center mb-8">{formatTime(time)}</div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartStop}
            className={`px-6 py-2 rounded-full text-white font-semibold ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
      </div>
      <Link href="/" className="mt-8 text-purple-600 hover:text-purple-800">
        Back to Home
      </Link>
    </div>
  );
};

export default Demo;
