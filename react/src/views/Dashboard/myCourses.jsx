import React, { useState, useEffect } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";

export default function MyCourses() {
  const { user } = useStateContext({});
  const [course, setCourse] = useState([]);
  const [isActive, setIsActive] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/course`, {
          params: {
            id: user.id,
          },
        });
        console.log(response);
        const data = response.data;
        if (
          typeof data === "object" &&
          data !== null &&
          Array.isArray(data.courses)
        ) {
          setCourse(data.courses);
          // Initialize isActive state
          const activeStates = {};
          data.courses.forEach((c) => {
            activeStates[c.id] = c.isactive === 1;
          });
          setIsActive(activeStates);
          console.log(data.courses);
        } else {
          console.error(
            "Data is not an object or does not have instructors property:",
            data
          );
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchData();
  }, [user.id]);

  const handleToggle = async (courseId) => {
    const newState = !isActive[courseId];

    try {
      // Toggle the state
      setIsActive((prevState) => ({ ...prevState, [courseId]: newState }));

      // Send the update request
      await axiosClient.patch(`/cr_toggleStatus`, {
        courseId,
        isactive: newState ? 1 : 0,
      });
    } catch (error) {
      console.error("Error updating course status", error);
      // Revert the toggle state on error
      setIsActive((prevState) => ({ ...prevState, [courseId]: !newState }));
    }
  };

  return (
    <div>
      <section className="flex flex-col w-full px-6 md:justify-between md:items-center md:flex-row">
        <div>
          <h2 className="text-3xl font-medium text-gray-800">Online Courses</h2>
          <p className="mt-2 text-sm text-gray-500">Dashboard</p>
        </div>
        <div className="flex flex-col mt-6 md:flex-row md:-mx-1 md:mt-0">
          <button className="px-6 py-3 focus:outline-none mt-4 text-white bg-blue-600 rounded-lg md:mt-0 md:mx-1 hover:bg-blue-500">
            <Link
              to="/dashboard/newCourse"
              className="flex items-center justify-center -mx-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mx-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="mx-1 text-sm capitalize">Create new course</span>
            </Link>
          </button>
        </div>
      </section>

      <section className="container mx-auto px-2 py-4 lg:px-4">
        <div className="flex flex-col mt-6">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
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
                        className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400"
                      >
                        <span>Status</span>
                      </th>
                      <th
                        scope="col"
                        className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-400"
                      >
                        <span>Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {course?.map((c) => (
                      <tr key={c.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <div className="flex items-center gap-x-2">
                              <div>
                                <h2 className="font-medium text-gray-800">
                                  {c.name}
                                </h2>
                                <p className="text-sm font-normal text-gray-600 dark:text-gray-8000">
                                  {c.category}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="flex items-center gap-x-3">
                            <div className="container2">
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
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-4">
                            <button className="noselect b2 flex-shrink-0">
                              <span className="text1">Delete</span>
                              <span className="icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                                </svg>
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                navigate("/dashboard/newCourse", {
                                  state: { courseId: c.id },
                                });
                              }}
                              className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none flex-shrink-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                navigate("/dashboard/myCourse/lessons", {
                                  state: { courseId: c.id },
                                });
                              }}
                              className="!text-dark-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none flex-shrink-0"
                            >
                              Lessons
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add responsive design for smaller screens */}
      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .table-container {
            overflow-x: auto;
          }
          .table {
            min-width: 600px;
          }
          .text1,
          .icon {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
