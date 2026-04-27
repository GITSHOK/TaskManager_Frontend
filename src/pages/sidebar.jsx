import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* 🔥 Mobile Toggle Button */}
      <button
        className="md:hidden p-3 bg-gray-900 text-white fixed top-2 left-2 z-50 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* 🔥 Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 flex flex-col gap-4 transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-4">TaskApp</h2>

        <Link to="/" className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-center">
          Home
        </Link>

        <Link to="/analytics" className="bg-green-600 hover:bg-green-700 p-2 rounded text-center">
          Analytics
        </Link>

        <Link to="/calender" className="bg-green-600 hover:bg-green-700 p-2 rounded text-center">
          Calender
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 p-2 rounded mt-auto"
        >
          Logout
        </button>
      </div>

      {/* 🔥 Background overlay (for mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default sidebar;