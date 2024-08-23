import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, Outlet, redirect } from "react-router-dom";
import axiosClient from "../axios";
import { makeStyles } from "@mui/styles";
import LogoutIcon from "@mui/icons-material/Logout";

const useStyles = makeStyles({
  ellipsis: {
    "&::after": {
      content: "...",
      display: "inline-block",
      overflow: "hidden",
      verticalAlign: "bottom",
      animation: "ellipsis steps(4, end) 900ms infinite",
      width: "0",
    },
  },
});

// dangerouslySetInnerHTML={{__html: description}}

export default function UserLayout() {
  const { user, setUser, setToken, token } = useStateContext({});
  const [fileimage, setPhoto] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to manage the main menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage the dropdown menu
  const [errors, setErrors] = useState(null);
  const type = user.type;

  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

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

  if (errors) {
    return <div>Error: {errors}</div>;
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
    Navigate("/");
  };

  return (
    <div>
      <div className="w-auto top-0 z-50 antialiased bg-gray-100 m-4 rounded dark:bg-gray-700 relative">
        <div className="w-full text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-700 rounded-md">
          <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between p-4">
              <a
                href="#"
                className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark:text-white focus:outline-none focus:shadow-outline"
              >
                Flowtrail UI
              </a>
              <button
                onClick={toggleMenu}
                className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-6 h-6"
                >
                  {menuOpen ? (
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>
            </div>
            <nav
              className={`${
                menuOpen ? "block" : "hidden"
              } md:flex md:items-center md:space-x-4 transition-all duration-300 ease-in-out`}
            >
              {!token && (
                <ul className="block w-full px-4 py-2 mt-2 space-y-2 md:flex md:items-center md:space-y-0 md:space-x-2 md:mt-0 md:flex">
                  <li>
                    <Link
                      aria-label="Sign in"
                      title="Sign in"
                      className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-white bg-deep-purple-accent-400 rounded-lg shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                      aria-label="Sign up"
                      title="Sign up"
                      to="/signup"
                    >
                      Sign up
                    </Link>
                  </li>
                </ul>
              )}

              {token && (
                <ul className="block w-full px-4 py-2 mt-2 space-y-2 md:flex md:items-center md:space-y-0 md:space-x-2 md:mt-0">
                  {user.type === "student" && (
                    <>
                      <li>
                        <Link
                          className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-white bg-deep-purple-accent-400 rounded-lg shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                          aria-label="Instructor"
                          title="Instructor"
                          to="/instructor"
                        >
                          Instructor
                        </Link>
                      </li>
                    </>
                  )}
                  {user.type === "admin" && (
                    <li>
                      <Link
                        className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-white bg-deep-purple-accent-400 rounded-lg shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                        aria-label="Dashboard"
                        title="Dashboard"
                        to="/dashboard"
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <button className="Btn" onClick={onLogout}>
                    <div className="sign">
                      <LogoutIcon></LogoutIcon>
                    </div>

                    <div className="text">Logout</div>
                  </button>
                </ul>
              )}
            </nav>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
