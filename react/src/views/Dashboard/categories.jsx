import React, { useState, useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import ModeEditTwoToneIcon from "@mui/icons-material/ModeEditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import AddCircleOutlineTwoToneIcon from "@mui/icons-material/AddCircleOutlineTwoTone";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios";

export default function categories() {
  const { user, setUser, setToken, token } = useStateContext({});
  const [category, setcategory] = useState([]);

  useEffect(() => {
    axiosClient
      .get(`/category`, {
        params: {
          id: user.id,
        },
      })
      .then(({ data }) => {
        // data.map((x) => setcategory(x));
        setcategory(data);
        //   console.log(data.category?.[0])
        //   console.log(category)
      });
  }, []);

  console.log(category);

  return (
    <div>
      <div className="flex flex-col w-full min-h-screen">
        <section className="flex flex-col w-full px-6 md:justify-between md:items-center md:flex-row">
          <div className="flex flex-col mt-6 md:flex-row md:-mx-1 md:mt-0">
            <button className="px-6 py-3 focus:outline-none mt-4 text-white bg-blue-600 rounded-lg md:mt-0 md:mx-1 hover:bg-blue-500">
              <Link
                to="/dashboard/newCategory"
                className="flex items-center justify-center -mx-1"
              >
                <AddCircleOutlineTwoToneIcon />

                <span className="mx-1 text-sm capitalize">
                  Create new Category
                </span>
              </Link>
            </button>
          </div>
        </section>
        <main className="flex-1 p-4 overflow-hidden">
          <div className="flex h-full w-full items-start gap-4">
            <div className="grid flex-1 gap-4">
              <div
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
                data-v0-t="card"
              >
                <div className="p-0">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&amp;_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[200px]">
                            Category
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                            Description
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[120px]">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="[&amp;_tr:last-child]:border-0">
                        {category.map((x) => (
                          <tr key={x.id}>
                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-semibold">
                              {x.name}
                            </td>
                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                              {x.description}
                            </td>
                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                              <div className="flex gap-2">
                                <Link
                                  to={"/dashboard/newCategory/" + x.id}
                                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-8 h-8"
                                >
                                  <ModeEditTwoToneIcon />
                                  <span className="sr-only">Edit</span>
                                </Link>
                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-8 h-8">
                                  <DeleteTwoToneIcon />
                                  <span className="sr-only">Delete</span>
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
          </div>
        </main>
      </div>
    </div>
  );
}
