//C:\react-js\myreactdev\src\Component\Addproduct.js
import React, { useState } from "react";
import { useEffect } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";

export default function Addproduct() {
  const navigate = useNavigate();

  let { id } = useParams();

  const [txtname, setName] = useState("");
  const [txtdescription, setdescription] = useState("");
  const [fileimage, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const { user, setUser, setToken, token } = useStateContext({});

  // Initialize category as an empty array
  const [category, setcategory] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/category", {
        params: {
          id: user.id,
        },
      })
      .then(({ data }) => {
        // Ensure data is an array before setting it to category
        if (Array.isArray(data)) {
          setcategory(data);
        } else {
          console.error("Received data is not an array", data);
          setcategory([]); // Set to empty array if data is not an array
        }
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
        setcategory([]); // Set to empty array in case of error
      });
  }, [user.id]); // Added user.id as a dependency if it's expected to change

  console.log(category);

  const uploadProduct = async () => {
    console.log(fileimage);
    const formData = new FormData();
    formData.append("name", txtname);
    formData.append("description", txtdescription);
    formData.append("image", fileimage);
    // formData.append("category", category);
    formData.append("teacher_id", user.id);
    const responce = await axiosClient.post("/course", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (responce) {
      console.log(responce);
      setMessage(responce.message); //"message": "Product successfully created."
      setTimeout(() => {
        navigate("/dashboard/mycourses");
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadProduct();
  };
  return (
    <React.Fragment>
      <div className=" m-auto max-w-2xl overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* <img
          className="object-cover w-full h-64"
          src={fileimage}
          alt="Article"
        /> */}

        <div className="p-6">
          {!id && (
            <div>
              <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">
                {txtname}
              </span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {txtdescription}
              </p>
              <a
                href="#"
                className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600 hover:underline"
                role="link"
              >
                {/* {course.category} */}
              </a>
            </div>
          )}

          {id && (
            <div>
              <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">
                {txtname}
              </span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {txtdescription}
              </p>
              <a
                href="#"
                className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600 hover:underline"
                role="link"
              >
                {/* {course.category} */}
              </a>
            </div>
          )}
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <img
                  className="object-cover h-10 rounded-full"
                  src={
                    "https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                  }
                  alt="Avatar"
                />
                <a
                  href="#"
                  className="mx-2 font-semibold text-gray-700 dark:text-gray-200 !inline-block"
                  role="link"
                >
                  {txtname}
                </a>
              </div>
              <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                21 SEP 2015
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-8 mt-4">
            <h5 className="mb-4">Add Product </h5>
            <p className="text-warning">{message}</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 row">
                <label className="col-sm-3">course Title </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-3">Description </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setdescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Course category
                </label>
                <div className="mt-2">
                  <select
                    id="country"
                    name="category"
                    autoComplete="Course-category"
                    onChange={(ev) => setcategory(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value=""></option>
                    {category?.map((x) => (
                      <option key={x.id} value={x.name}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-3">Product Image</label>
                <div className="col-sm-9">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-3"></label>
                <div className="col-sm-9">
                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
