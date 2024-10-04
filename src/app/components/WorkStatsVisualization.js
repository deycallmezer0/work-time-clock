// app/components/WorkStatsVisualization.js
"use client"

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WorkStatsVisualization = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchWorkStats();
  }, [userId]);

  const fetchWorkStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/workstats/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const statsData = await res.json();
        setData(statsData);
      } else {
        throw new Error('Failed to fetch work stats');
      }
    } catch (error) {
      console.error('Error fetching work stats:', error);
    }
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="hoursWorked" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="earnings" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkStatsVisualization;