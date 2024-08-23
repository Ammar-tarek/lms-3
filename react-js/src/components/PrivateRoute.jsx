import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, userType, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const storedUserType = localStorage.getItem("type"); // Retrieve type from local storage

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && storedUserType === userType ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
