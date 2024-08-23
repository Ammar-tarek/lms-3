import React, { useState, useEffect } from "react";
import axiosClient from "../../../axios";
import { useStateContext } from "../../../contexts/ContextProvider";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function StudentsLesson() {
  const { user, setUser, setToken, token } = useStateContext({});
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/st_in_lesson", {
        params: {
          lesson_id: location.state.lessonId,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  return (
    <div className="p-4">
      <section className="flex flex-col w-full md:justify-between md:items-center md:flex-row mb-4">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
          Students Table
        </h2>
      </section>

      <section className="w-full overflow-x-auto">
        <div className="flex flex-col">
          <div className="mx-4 my-2 overflow-x-auto sm:mx-6 lg:mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="py-2 px-2 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                        Name
                      </th>
                      <th className="py-2 px-2 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                        Email
                      </th>
                      <th className="py-2 px-2 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                        Enrollment Date
                      </th>
                      <th className="py-2 px-2 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                        Lesson Name
                      </th>
                      <th className="py-2 px-2 text-sm font-normal text-left text-gray-500 dark:text-gray-400">
                        Grades
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="py-2 px-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                          {user.name}
                        </td>
                        <td className="py-2 px-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="py-2 px-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                          {user.payments[0]?.payment_date}
                        </td>
                        <td className="py-2 px-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                          {user.payments[0]?.lesson.name || "N/A"}
                        </td>
                        <td className="py-2 px-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                          Assignments:{" "}
                          {user.grades
                            .filter((grade) => grade.type === "assignment")
                            .map((grade) => (
                              <span key={grade.id}>({grade.grade}), </span>
                            ))}
                          <br />
                          Quizzes:{" "}
                          {user.grades
                            .filter((grade) => grade.type === "quiz")
                            .map((quiz) => (
                              <span key={quiz.id}>({quiz.grade}), </span>
                            ))}
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
    </div>
  );
}
