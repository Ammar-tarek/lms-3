import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";

export default function Lesson() {
  let { id } = useParams();
  const { user, setUser } = useStateContext({});
  const [lessons, setLessons] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchLessons = () => {
    if (location.state && location.state.courseId) {
      axiosClient
        .get("/instructor_Lessons", {
          params: {
            id: location.state.courseId,
          },
        })
        .then(({ data }) => {
          setLessons(data.lessons);
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
        });
    } else {
      console.error("courseId is not available in location.state");
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [location.state]);

  const handleDeleteLesson = (lessonId) => {
    axiosClient
      .delete(`/del_lesson/${lessonId}`)
      .then(() => {
        fetchLessons(); // Refresh the lessons after successful deletion
      })
      .catch((error) => {
        console.error("Error deleting lesson:", error);
      });
  };

  if (!location.state || !location.state.courseId) {
    return <div>Error: courseId is missing in location.state</div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold text-lg md:text-2xl">Lessons</h1>
          <button
            type="button"
            className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              navigate("/dashboard/myCourse/lesson/addLesson", {
                state: { courseId: location.state.courseId },
              });
            }}
          >
            <span>Create new Lesson</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
              height="24"
              fill="none"
              className="w-6 h-6"
            >
              <line y2="19" y1="5" x2="12" x1="12"></line>
              <line y2="12" y1="12" x2="19" x1="5"></line>
            </svg>
          </button>
        </div>
        <div className="border shadow-sm rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium  md:table-cell">
                  Duration
                </th>
                <th className="px-4 py-2 text-left font-medium">Price</th>
                <th className="px-4 py-2 text-left font-medium  md:table-cell">
                  File Name
                </th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((x) => (
                <tr key={x.id} className="border-b">
                  <td className="px-4 py-2">{x.name}</td>
                  <td className="px-4 py-2 md:table-cell">
                    {x.video_duration}
                  </td>
                  <td className="px-4 py-2">${x.price}</td>
                  <td className="px-4 py-2 md:table-cell">{x.video_path}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        navigate("/dashboard/myCourse/lesson/viewLesson", {
                          state: { lessonId: x.id },
                        });
                      }}
                      className="text-gray-800 hover:text-yellow-500"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        navigate("/dashboard/myCourse/lesson/addLesson", {
                          state: {
                            courseId: location.state.courseId,
                            lessonId: x.id,
                            lessonName: x.name,
                          },
                        });
                      }}
                      className="text-gray-800 hover:text-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(x.id)}
                      className="text-gray-800 hover:text-red-500"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        navigate("/dashboard/myCourse/lesson/students", {
                          state: { lessonId: x.id },
                        });
                      }}
                      className="text-gray-800 hover:text-green-500"
                    >
                      Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
