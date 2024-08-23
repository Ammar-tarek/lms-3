import React, { Fragment, useEffect, useState } from "react";
import "./App.css";

function App() {
  // https://reqres.in/api/users
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    setLoading(true);
    const response = await fetch("https://reqres.in/api/users");
    const data = await response.json();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Fragment>
      <h1>React fetch</h1>
      <div className="main">
        <section className="section">
          <h2>Get database</h2>
          <div>
            {loading ? (
              <Fragment>loading..</Fragment>
            ) : (
              profile.map(i => {
                <Fragment>
                  <ul>
                    <li>{i.id}</li>
                    <li>{i.email}</li>
                    <li>{i.first_name}</li>
                    <li>{i.last_name}</li>
                    <li>
                      <image src={i.avatar} />
                    </li>
                  </ul>
                </Fragment>;
              })
            )}
          </div>
        </section>
        <form className="section">
          <h2>Post data</h2>
          <input type="text" placeholder="enter detail" />
          <button type="submit">Post</button>
        </form>
        <form className="section">
          <h2>Update data</h2>
          <select>
            <option>Choose data</option>
          </select>
          <input type="text" placeholder="enter detail" />
          <button type="submit">Update</button>
        </form>
      </div>
    </Fragment>
  );
}

export default App;