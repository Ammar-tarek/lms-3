import React, { useState } from "react";
import { useEffect } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
export default function instructor() {
  const navigate = useNavigate();

  const [txtname, setName] = useState("");
  const [txtdescription, setdescription] = useState("");
  const [fileimage, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const { user, setUser, setToken, token } = useStateContext({});
  const [course, setCourse] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/home", {
          // params: {
          //   id: user.id,
          // },
        });
        console.log(response);
        const data = response.data;
        if (
          typeof data === "object" &&
          data !== null &&
          Array.isArray(data.instructors)
        ) {
          setName(data.instructors[0].name);
          setdescription(data.instructors[0].description);
          setPhoto(data.instructors[0].image_path);
          setCourse(data.courses);
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
  return (
    <div>
      <section className="w-full py-8">
        <div className="container grid items-center gap-10 px-4 md:px-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm">
              Instructor
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {txtname}
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {txtdescription}
            </p>
          </div>
          <img
            src={`http://localhost:8000/uploads/${fileimage}`}
            width="600"
            height="600"
            alt="Instructor"
            className="mx-auto aspect-square rounded-xl object-cover"
          />
        </div>
      </section>
      <section className="w-full rounded py-8 md:py-8 lg:py-8 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-4 md:gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-black">
                Courses
              </h2>
              <a
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="#"
              >
                View All
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {course?.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm"
                  data-v0-t="card"
                >
                  <div className="p-12 flex flex-col gap-4">
                    <img
                      src={`http://localhost:8000/uploads/${c.image_path}`}
                      width="400"
                      height="225"
                      alt="Course image"
                      className="rounded-md object-cover"
                      // style="aspect-ratio: 400 / 225; object-fit: cover;"
                    />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-red-400">
                        {c.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {c.description}
                      </p>
                      <button
                        onClick={() => {
                          navigate("/instructor/course", {
                            state: { courseId: c.id },
                          });
                        }}
                        to={"/instructor/" + c.id}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        href="#"
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
