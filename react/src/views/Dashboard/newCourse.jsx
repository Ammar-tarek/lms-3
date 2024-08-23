import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";

export default function Addproduct() {
  const location = useLocation();
  const navigate = useNavigate();
  let { id } = useParams();
  const { user } = useStateContext();
  const [txtname, setName] = useState("");
  const [txtdescription, setDescription] = useState("");
  const [fileimage, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axiosClient
      .get("/category", {
        params: {
          id: user.id,
        },
      })
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Received data is not an array", data);
          setCategories([]); // Set to empty array if data is not an array
        }
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
        setCategories([]); // Set to empty array in case of error
      });
  }, [user.id]);

  const uploadProduct = async () => {
    const formData = new FormData();
    formData.append("id", location.state.courseId);
    formData.append("name", txtname);
    formData.append("category", selectedCategory); // Append selected category
    formData.append("description", txtdescription);
    formData.append("image", fileimage);
    formData.append("teacher_id", user.id);

    try {
      const response = await axiosClient.put("/upt_courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) {
        setMessage(response.data.message); // Assuming response has a message property
        setTimeout(() => {
          navigate("/dashboard/mycourses");
        }, 2000);
      }
    } catch (error) {
      console.error("Error uploading product", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadProduct();
  };

  console.log(location.state.courseId);

  return (
    <React.Fragment>
      <div className="m-auto max-w-2xl overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="p-6">
          {!location.state.courseId && (
            <div>
              <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">
                {txtname}
              </span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {txtdescription}
              </p>
            </div>
          )}
          {location.state.courseId && (
            <div>
              <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">
                {txtname}
              </span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {txtdescription}
              </p>
            </div>
          )}
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <img
                  className="object-cover h-10 rounded-full"
                  src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                  alt="Avatar"
                />
                <a
                  href="#"
                  className="mx-2 font-semibold text-gray-700 dark:text-gray-200"
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
            <h5 className="mb-4">Add Product</h5>
            <p className="text-warning">{message}</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 row">
                <label className="col-sm-3">Course Title</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-3">Description</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Course Category
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    autoComplete="course-category"
                    onChange={(ev) => setSelectedCategory(ev.target.value)} // Set selected category
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select a category</option>{" "}
                    {/* Add default option */}
                    {categories.map((x) => (
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
