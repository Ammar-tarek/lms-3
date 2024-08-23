import React, { useState, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link, Navigate, Outlet, redirect } from "react-router-dom";
import axiosClient from "../../axios";

const Dashboard = () => {
  const { user, setUser, setToken, token } = useStateContext({});
  const [fileimage, setPhoto] = useState("");

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
    Navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get("/user");
        setUser(data);
        console.log(data);
      } catch (errors) {
        console.error("Error fetching user data", errors);
        setErrors("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    if (!user.id) {
      fetchData();
    }
  }, [user.id]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">LMS Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">Hi, {user.name}</span>
            <button
              onClick={onLogout}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white rounded m-6 shadow-lg flex flex-col p-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              className="h-32 w-32 rounded-full"
              src="https://via.placeholder.com/150"
              alt="Profile Picture"
            />
            <div className="text-center">
              <h2 className="text-lg font-medium">Hi, {user.name}</h2>
              <p className="text-gray-600">Welcome to your dashboard</p>
            </div>
          </div>

          <nav className="mt-6 flex-grow">
            <ul>
              <li className="mb-4">
                <a
                  href="#"
                  className="text-blue-500 hover:bg-blue-500 hover:text-white block px-4 py-2 rounded"
                >
                  Overview
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="#"
                  className="hover:bg-blue-500 hover:text-white block px-4 py-2 rounded"
                >
                  Profile
                </a>
              </li>
              <li className="mb-4">
                <Link
                  to="/profile/wallet"
                  className="hover:bg-blue-500 hover:text-white block px-4 py-2 rounded"
                >
                  Wallet
                </Link>
              </li>
              <li className="mb-4">
                <a
                  href="#"
                  className="hover:bg-blue-500 hover:text-white block px-4 py-2 rounded"
                >
                  Classrooms
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="#"
                  className="hover:bg-blue-500 hover:text-white block px-4 py-2 rounded"
                >
                  Activity
                </a>
              </li>
              <li className="mb-4">
                <a
                  href="#"
                  className="hover:bg-blue-500 hover:text-white block px-4 py-2 rounded"
                >
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-grow p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
