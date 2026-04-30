import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./sidebar.jsx";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from "recharts";

const Analytics = () => {
  const [taskCount, setTaskcount] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("https://taskmanager-backend-0a21.onrender.com/taskstats", {
      headers: { Authorization: token }
    })
    .then(res => setTaskcount(res.data))
    .catch(err => console.log(err));
  }, [token]);

  // Pie Chart Data
  const pieData = taskCount
    ? [
        { name: "Completed", value: taskCount.completed },
        { name: "Pending", value: taskCount.pending }
      ]
    : [];

  // Completion %
  const completionRate = taskCount
    ? ((taskCount.completed / taskCount.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-50 space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p>Total</p>
            <h2 className="text-xl font-bold">{taskCount?.total}</h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p>Completed</p>
            <h2 className="text-green-600 text-xl font-bold">{taskCount?.completed}</h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p>Pending</p>
            <h2 className="text-red-500 text-xl font-bold">{taskCount?.pending}</h2>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p>Completion %</p>
            <h2 className="text-blue-600 text-xl font-bold">{completionRate}%</h2>
          </div>
        </div>

        {/* Pie Chart */}
        {taskCount && (
          <div className="bg-white p-4 rounded shadow w-fit">
            <h3 className="mb-2 font-semibold">Task Distribution</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}

        {/* Line Chart (Tasks Over Time) */}

        {/* Bar Chart (Group-wise) */}
        {taskCount?.groupStats && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="mb-2 font-semibold">Group-wise Tasks</h3>
            <BarChart width={600} height={300} data={taskCount.groupStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#22c55e" />
              <Bar dataKey="pending" fill="#ef4444" />
            </BarChart>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;