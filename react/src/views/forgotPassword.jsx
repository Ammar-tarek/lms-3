import { useStateContext } from "../contexts/ContextProvider.jsx";
import { Link, Navigate } from "react-router-dom";
import { createRef, useState } from "react";
import axiosClient from "../axios.js";

export default function ForgotPassword() {
  const emailRef = createRef();
  const questionRef = createRef();
  const answerRef = createRef();

  const { token } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const questions = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was your first car?",
    "What elementary school did you attend?",
    "What is the name of the town where you were born?",
  ];

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      security_question: questionRef.current.value,
      security_answer: answerRef.current.value,
    };

    axiosClient
      .post("/forgot-password", payload)
      .then(({ data }) => {
        setSuccess(true);
        console.log(data);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  if (success) {
    return <Navigate to="/resetPassword" />;
  }

  return (
    <div>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Forgot Password
      </h2>

      {errors && (
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="security-question"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Security Question
            </label>
            <div className="mt-2">
              <select
                id="security-question"
                name="security_question"
                ref={questionRef}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select a security question</option>
                {questions.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="security-answer"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Security Answer
            </label>
            <div className="mt-2">
              <input
                id="security-answer"
                name="security_answer"
                type="text"
                ref={answerRef}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
