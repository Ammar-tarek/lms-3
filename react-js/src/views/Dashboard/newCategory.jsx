import React, { useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function NewCategory() {
  // let history = useHistory();
  const navigate = useNavigate();

  let { id } = useParams();
  console.log(id);

  if (id) {
    console.log(id);
    useEffect(() => {
      // courses?id=2
      axiosClient.get(`/courses/${id}`).then(({ data }) => {
        // setLoading(false)
        // setCourse(data?.[0]?.[0])
        // setCourse({ ...course, description: ev.target.value })
        setCourse({
          ...course,
          name: data?.[0]?.[0].name,
          description: data?.[0]?.[0].description,
          category: data?.[0]?.[0].category,
          teacher_id: data?.[0]?.[0].teacher_id,
          id: id,
        });
        console.log(data);
        console.log(course);
      });
    }, []);
  }

  const { user, setUser, setToken, token } = useStateContext({});
  const [errors, setErrors] = useState(null);
  const [err, setErr] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploaded, setisUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // console.log(user.id);

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (id) {
      console.log(id);
      axiosClient
        .put("/courses/update", course, id)
        .then(({ data }) => {
          setErr(true);
          console.log(data);
          // console.log(course)
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
            setErr(false);
          }
        });
    } else {
      axiosClient
        .post("/category", category)
        .then(({ data }) => {
          setErr(true);
          console.log(data);
          // console.log(course)
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
            setErr(false);
          }
        });
    }
  };

  if (err === true) {
    // console.log(response);
    // setMessage(responce.message); //"message": "Product successfully created."
    setTimeout(() => {
      navigate("/dashboard/categories");
    }, 2000);
  }

  const [category, setCategory] = useState({
    id: null,
    teacher_id: user.id,
    name: "",
    description: "",
  });

  return (
    <div>
      <form
        className=" ml-10 mr-10 mt-10"
        action="#"
        method="post"
        onSubmit={onSubmit}
      >
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        <div className="sm:col-span-3 mt-10">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Category Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="Course-name"
              id="first-name"
              onChange={(ev) =>
                setCategory({ ...category, name: ev.target.value })
              }
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="space-y-12 content-center">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="Description"
                    rows={3}
                    onChange={(ev) =>
                      setCategory({ ...category, description: ev.target.value })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
