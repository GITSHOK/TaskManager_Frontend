import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate,Link } from "react-router-dom"
import sidebar from "./sidebar";

const Home = () => {

  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [groupInputs, setGroupInputs] = useState({});
  const [newGroup, setNewGroup] = useState("");

  const [edit, setEdit] = useState({
    id: null,
    taskName: "",
    completed: false
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // 👤 get user
  useEffect(() => {
    axios.get("https://taskmanager-backend-0a21.onrender.com/get-user", {
      headers: { Authorization: token }
    })
    .then(res => setName(res.data.name))
    .catch(() => navigate('/login'));
  }, []);

  // 📋 get tasks
  useEffect(() => {
  if (!token) {
    console.log("❌ No token found");
    return;
  }

  console.log("🟡 TOKEN SENT:", token);

  axios.get("https://taskmanager-backend-0a21.onrender.com/get-tasks", {
    headers: { Authorization: token }
  })
  .then(res => {
    console.log("🟢 TASK RESPONSE:", res.data);

    if (Array.isArray(res.data)) {
      setTasks(res.data);
    } else {
      console.log("❌ Not an array:", res.data);
      setTasks([]);
    }
  })
  .catch(err => {
    console.log("❌ FETCH ERROR:", err);
    setTasks([]);
  });

}, [token]);

  // 🧠 group tasks
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.group]) acc[task.group] = [];
    acc[task.group].push(task);
    return acc;
  }, {});

  // ✏️ input change per group
  const handleInputChange = (group, value) => {
    setGroupInputs(prev => ({
      ...prev,
      [group]: value
    }));
  };

  // ➕ add task
  const handleAdd = (group) => {
    const text = groupInputs[group];
    if (!text) return;

    axios.post(
      "https://taskmanager-backend-0a21.onrender.com/add-task",
      { taskName: text, group },
      { headers: { Authorization: token } }
    )
    .then(res => {
      setTasks(prev => [...prev, res.data]);
      setGroupInputs(prev => ({ ...prev, [group]: "" }));
    });
  };

  // ➕ create group (UI only)
  const handleCreateGroup = () => {
    if (!newGroup) return;

    setTasks(prev => [...prev, { taskName: "", group: newGroup }]);
    setNewGroup("");
  };

  // ✏️ edit click
  const handleEditClick = (task) => {
    setEdit({
      id: task._id,
      taskName: task.taskName,
      completed: task.completed || false
    });
  };

  // 💾 save edit
  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://taskmanager-backend-0a21.onrender.com/update-task/${edit.id}`,
        {
          taskName: edit.taskName,
          completed: edit.completed
        },
        { headers: { Authorization: token } }
      );

      setTasks(prev =>
        prev.map(t =>
          t._id === edit.id
            ? { ...t, taskName: edit.taskName, completed: edit.completed }
            : t
        )
      );

      setEdit({ id: null, taskName: "", completed: false });

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ toggle completion
  const handleToggle = async (task) => {
    try {
      await axios.put(
        `https://taskmanager-backend-0a21.onrender.com/update-task/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: token } }
      );

      setTasks(prev =>
        prev.map(t =>
          t._id === task._id
            ? { ...t, completed: !t.completed }
            : t
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
    <sidebar />
    <div className="p-6">

      <h2 className="font-bold text-xl mb-4">Welcome {name}</h2>

      {/* ➕ Create Group */}
      <div className="flex gap-2 mb-6 max-w-md">
        <input
          type="text"
          placeholder="New group name"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleCreateGroup}
          className="bg-green-500 text-white px-3 rounded"
        >
          Add Group
        </button>
      </div>

      {/* 🧩 GROUP GRID (WRAPS AUTOMATICALLY) */}
      <div className="flex flex-wrap gap-4">

        {Object.keys(groupedTasks).map((grp, i) => (
          <div
            key={i}
            className="w-[250px] bg-gray-100 p-3 rounded shadow"
          >

            <h3 className="font-semibold mb-2">{grp}</h3>

            {/* tasks */}
            {groupedTasks[grp]
              .filter(t => t.taskName)
              .map((t, j) => (
                <div key={j} className="border p-1 rounded mt-1 flex gap-2 items-center bg-white">

                  <input
                    type="checkbox"
                    checked={t.completed || false}
                    onChange={() => handleToggle(t)}
                  />

                  {edit.id === t._id ? (
                    <>
                      <input
                        type="text"
                        value={edit.taskName}
                        onChange={(e) =>
                          setEdit({ ...edit, taskName: e.target.value })
                        }
                        className="border p-1 flex-1"
                      />

                      <input
                        type="checkbox"
                        checked={edit.completed}
                        onChange={(e) =>
                          setEdit({ ...edit, completed: e.target.checked })
                        }
                      />

                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-2 rounded"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className={`flex-1 ${
                          t.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {t.taskName}
                      </span>

                      <button
                        onClick={() => handleEditClick(t)}
                        className="bg-yellow-500 text-white px-2 rounded"
                      >
                        Edit
                      </button>
                    </>
                  )}

                </div>
              ))
            }

            {/* add task */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Add task"
                value={groupInputs[grp] || ""}
                onChange={(e) => handleInputChange(grp, e.target.value)}
                className="border p-1 rounded flex-1"
              />
              <button
                onClick={() => handleAdd(grp)}
                className="bg-blue-500 text-white px-2 rounded"
              >
                Add
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
    </div>
  )
}

export default Home;