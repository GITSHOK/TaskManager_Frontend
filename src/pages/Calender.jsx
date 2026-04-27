import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const Calender = () => {
  const [date, setDate] = useState(new Date());
  const token = localStorage.getItem("token");
  const [dateTasks, setDateTasks] = useState([]);

  useEffect(() => {
    axios.get("https://taskmanager-backend-0a21.onrender.com/get-tasks", {
      headers: { Authorization: token } // ✅ fixed typo
    })
    .then(res => setDateTasks(res.data))
    .catch(err => console.log(err));
  }, [token]);

  // Filter tasks for selected date
  const filteredTasks = dateTasks.filter(task => {
    const taskDate = new Date(task.createdAt);

    return (
      taskDate.getFullYear() === date.getFullYear() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getDate() === date.getDate()
    );
  });
  //To get task per date in a neat format
  const tasksByDate = {};
  dateTasks.forEach(task => {
    const d = new Date(task.createdAt).toDateString();

    if(!tasksByDate[d]){
      tasksByDate[d] = [];
    }
    tasksByDate[d].push(task);
  })
  

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">

        <h1 className="text-2xl font-bold mb-4">Calendar</h1>

        <div className="bg-white p-6 rounded shadow w-fit">

          {/* Calendar */}
          <Calendar 
  onChange={setDate} 
  value={date} 

  tileClassName={({ date: tileDate, view }) => {
    if (view !== "month") return;

    const dayTasks = tasksByDate[tileDate.toDateString()];
    if (!dayTasks) return;

    const hasIncomplete = dayTasks.some(t => !t.completed);

    return hasIncomplete ? "bg-red-400 text-white" : "bg-green-400 text-white";
  }}
/>

          {/* Selected Date */}
          <p className="mt-4 font-medium">
            Selected: {date.toDateString()}
          </p>

          {/* 🔥 Tasks Display */}
          <div className="mt-4 w-full">
  <h2 className="font-semibold mb-2">Tasks on this day:</h2>
  <h5 className="font-semibold mb-1">Total Number of tasks:{dateTasks.length}</h5>
  <h5 className="font-semibold mb-1">Number of tasks for today:{filteredTasks.length}</h5>

  <div className="max-h-60 overflow-y-auto pr-2">
    {filteredTasks.length === 0 ? (
      <p className="text-gray-500">No tasks</p>
    ) : (
      filteredTasks.map(task => (
        <div
          key={task._id}
          className="border p-2 mb-2 rounded flex justify-between"
        >
          <span>{task.taskName}</span>
          <span className={task.completed ? "text-green-600" : "text-red-500"}>
            {task.completed ? "Done" : "Pending"}
          </span>
        </div>
      ))
    )}
  </div>
</div>

        </div>

      </div>
    </div>
  );
};

export default Calender;