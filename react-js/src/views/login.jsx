import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate } from "react-router-dom";
import { createRef, useState, useEffect } from "react";
import axiosClient from "../axios.js";
import Countdown from "react-countdown";
import DOMPurify from "dompurify";
import validator from "validator"; // Import validator for ASCII check
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();

  const { user, setUser, token, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timer, setTimer] = useState(Date.now());

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const validateInput = (input) => {
    return validator.isAscii(input); // Ensure the input contains only valid ASCII characters
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    if (isBlocked) {
      return;
    }

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!validateInput(email) || !validateInput(password)) {
      setErrors({ general: ["Invalid input detected."] });
      return;
    }

    const payload = {
      email: sanitizeInput(email),
      password: sanitizeInput(password),
    };

    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        if (data.user.active === 0) {
          toast.error("Your account is inactive. please contact your teacher"); // Display toast message
          return;
        }

        setUser(data.user.name);
        setToken(data.token);
        localStorage.setItem("type", data.user.type); // Save type in local storage
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 403) {
          toast.error("Your account is inactive. please contact your teacher"); // Display toast message for 403 Forbidden
        } else if (response && response.status === 422) {
          setErrors(response.data.errors);
          setAttempts((prev) => prev + 1);

          if (attempts + 1 >= 3) {
            setIsBlocked(true);
            setTimer(Date.now() + 60000); // 1 minute timer
          }
        } else {
          toast.error("An unexpected error occurred."); // Handle other errors
        }
      });
  };

  const handleTimerComplete = () => {
    setIsBlocked(false);
    setAttempts(0);
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {/* Ensure ToastContainer is included */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={1}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Login to your account
      </h2>
      {errors && (
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      {isBlocked && (
        <div className="alert alert-danger">
          Too many login attempts. Please wait for{" "}
          <Countdown date={timer} onComplete={handleTimerComplete} /> before
          trying again.
        </div>
      )}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                ref={emailRef}
                required
                disabled={isBlocked}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to={"/forgotPassword"}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                ref={passwordRef}
                required
                disabled={isBlocked}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={isBlocked}
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
}
