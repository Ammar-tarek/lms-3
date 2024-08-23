import React, { useState } from "react";
import { useEffect } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";

export default function profile() {
  const navigate = useNavigate();

  let { id } = useParams();
  const location = useLocation();

  const [txtname, setName] = useState("");
  const [txtdescription, setdescription] = useState("");
  const [fileimage, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const { user, setUser, setToken, token } = useStateContext({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/instructor", {
          params: {
            id: user.id,
          },
        });

        const data = response.data;
        if (
          typeof data === "object" &&
          data !== null &&
          Array.isArray(data.instructors)
        ) {
          setName(data.instructors[0].name);
          setdescription(data.instructors[0].description);
          setPhoto(data.instructors[0].image_path);
          console.log(data);
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

  const uploadProduct = async () => {
    console.log(fileimage);
    const formData = new FormData();
    formData.append("name", txtname);
    formData.append("description", txtdescription);
    formData.append("image", fileimage);
    formData.append("teacher_id", user.id);
    const responce = await axiosClient.post("/instructor", formData, {
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

  console.log(location);

  return (
    <div>
      <section className="w-full">
        <div className="container grid items-center gap-10 px-4 md:px-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-block rounded-lg px-3 py-1 text-sm bg-white">
              Instructor
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {txtname}
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {txtdescription}
            </p>
          </div>
          {/*<source src={`http://localhost:8000/videos/${lesson}`} />*/}
          <img
            src={`http://localhost:8000/uploads/${fileimage}`}
            width="600"
            height="600"
            alt="Jane Doe"
            className="mx-auto aspect-square rounded-xl object-cover"
          />
        </div>
      </section>

      <div className=" bg-gray-200 rounded-md m-8">
        <React.Fragment>
          <div className="container">
            <div className="row">
              <div className="col-md-8 mt-4">
                <h2 className="mb-4 text-center text-3xl">
                  Edit Your Information{" "}
                </h2>
                <p className="text-warning">{message}</p>

                <form onSubmit={handleSubmit} className=" !mr-5">
                  <div className="mb-3 row">
                    <label className="col-sm-3">Your Name </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3 row">
                    <label className="col-sm-3">
                      Description About your self{" "}
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setdescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3 row">
                    <label className="col-sm-3">Your Image</label>
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
      </div>
    </div>
  );
}
