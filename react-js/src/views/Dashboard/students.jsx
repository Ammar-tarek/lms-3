import React, { useState, useEffect } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import WalletIcon from "@mui/icons-material/Wallet";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme, useMediaQuery } from "@mui/material";

export default function Students() {
  const { user } = useStateContext({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isActive, setIsActive] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(`/users`, {
        params: {
          instructor_id: user.id,
          page: currentPage,
          limit: 50,
          search: searchQuery,
        },
      });
      const activeStatus = data.users.reduce((acc, user) => {
        acc[user.id] = user.status === 1;
        return acc;
      }, {});
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setIsActive(activeStatus);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    const newStatus = !isActive[id];
    try {
      await axiosClient.post(`/userStatus`, {
        user_id: id,
        status: newStatus ? 1 : 0,
      });
      setIsActive((prev) => ({ ...prev, [id]: newStatus }));
    } catch (error) {
      console.error("Failed to change status", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  return (
    <div>
      <section className="flex flex-col w-full px-6 md:justify-between md:items-center md:flex-row">
        <div>
          <h2 className="text-3xl font-medium text-gray-800">Students Table</h2>
        </div>
      </section>

      <section className="container px-4 mx-auto">
        <div className="flex flex-col mt-6">
          <div className="mb-4">
            <input
              type="text"
              className="px-4 py-2 border rounded-lg w-full md:w-1/3"
              placeholder="Search for students..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div
                  className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg"
                  style={{ maxHeight: "500px", overflowY: "scroll" }}
                >
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex items-center gap-x-3">
                            <span>Name</span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400"
                        >
                          <span>Email</span>
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400"
                        >
                          <span>Status</span>
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400"
                        >
                          <span>Enrollment Date</span>
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400"
                        >
                          <span>Course Name</span>
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400"
                        >
                          <span>Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((c) => (
                        <tr key={c.id}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center gap-x-3">
                              <div className="flex items-center gap-x-2">
                                <div>
                                  <h2 className="font-medium text-gray-800">
                                    {c.name}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center gap-x-3">
                              <div className="flex items-center gap-x-2">
                                <div>
                                  <h2 className="font-medium text-gray-800">
                                    {c.email}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="container2 flex items-center">
                              <input
                                type="checkbox"
                                className="checkbox"
                                id={`checkbox-${c.id}`}
                                checked={isActive[c.id] || false}
                                onChange={() => handleToggle(c.id)}
                              />
                              <label
                                className="switch"
                                htmlFor={`checkbox-${c.id}`}
                              >
                                <span className="slider"></span>
                              </label>
                            </div>
                            <span className="text-sm font-normal">
                              {isActive[c.id] ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            {c.enrollments[0]?.enrollment_date || "N/A"}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            {c.enrollments[0]?.course?.name || "N/A"}
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-6">
                              <button
                                onClick={() => {
                                  navigate("/dashboard/student/wallet", {
                                    state: { stId: c.id, stName: c.name },
                                  });
                                }}
                                className="transition-colors duration-200 hover:text-red-500 focus:outline-none"
                              >
                                <WalletIcon />
                              </button>
                              <button
                                onClick={() => {
                                  navigate("/dashboard/students/lessons", {
                                    state: { stId: c.id },
                                  });
                                }}
                                className="!text-dark-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                              >
                                viewed Lessons
                              </button>{" "}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 text-sm text-white bg-gray-800 rounded-lg hover:bg-gray-700"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 text-sm text-white bg-gray-800 rounded-lg hover:bg-gray-700"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
