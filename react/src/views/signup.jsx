import { Link, Navigate } from "react-router-dom";
import { createRef, useState } from "react";
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import DOMPurify from "dompurify";
import validator from "validator"; // Import validator for ASCII check

export default function Signup() {
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const passwordConfirmationRef = createRef();
  const questionRef = createRef();
  const answerRef = createRef();

  const { user, setUser, token, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [err, setErr] = useState(false);

  const questions = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was your first car?",
    "What elementary school did you attend?",
    "What is the name of the town where you were born?",
  ];

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const validateInput = (input) => {
    const invalidPatterns = [
      /<script.*?>.*?<\/script>/gi, // XSS
      /<.*?on\w+.*?=.*?>/gi, // XSS
      /[<>]/g, // XSS and command injection
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL injection
      /(;|\|)/g, // Command injection
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|CAST|DECLARE|NVARCHAR|CHAR|CONVERT|TABLE|FROM|WHERE|AND|OR|LIMIT|OFFSET|HAVING|NULL|IS NULL|IS NOT NULL)\b/gi, // SQL keywords
    ];

    for (let pattern of invalidPatterns) {
      if (pattern.test(input)) {
        return false;
      }
    }

    return validator.isAscii(input); // Ensure the input contains only valid ASCII characters
  };
  const validateInput1 = (input) => {
    const invalidPatterns = [
      /<script.*?>.*?<\/script>/gi,
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|CAST|DECLARE|NVARCHAR|CHAR|CONVERT|TABLE|FROM|WHERE|AND|OR|LIMIT|OFFSET|HAVING|NULL|IS NULL|IS NOT NULL)\b/gi, // SQL keywords
    ];

    for (let pattern of invalidPatterns) {
      if (pattern.test(input)) {
        return false;
      }
    }

    return validator.isAscii(input); // Ensure the input contains only valid ASCII characters
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirmation = passwordConfirmationRef.current.value;
    const securityQuestion = questionRef.current.value;
    const securityAnswer = answerRef.current.value;

    if (
      !validateInput(name) ||
      !validateInput(securityAnswer) ||
      !validateInput1(password) ||
      !validateInput1(passwordConfirmation)
    ) {
      setErrors({ general: ["Invalid input detected."] });
      return;
    }

    const payload = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      password: sanitizeInput(password),
      password_confirmation: sanitizeInput(passwordConfirmation),
      security_question: sanitizeInput(securityQuestion),
      security_answer: sanitizeInput(securityAnswer),
    };

    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user.name);
        setToken(data.token);
        setErr(true);
        console.log(data);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
          setErr(false);
        }
      });
    console.log(user);
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Signup for free
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Login with your account
        </Link>
      </p>

      {errors && (
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-6 m-96"
        action="#"
        method="POST"
      >
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="-space-y-px rounded-md shadow-sm">
          <div>
            <label htmlFor="full-name" className="sr-only">
              Full Name
            </label>
            <input
              id="full-name"
              name="name"
              type="text"
              ref={nameRef}
              required
              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              ref={emailRef}
              required
              className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              ref={passwordRef}
              className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <label htmlFor="password-confirmation" className="sr-only">
              Password Confirmation
            </label>
            <input
              id="password-confirmation"
              name="password_confirmation"
              type="password"
              required
              ref={passwordConfirmationRef}
              className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Password Confirmation"
            />
          </div>
          <div>
            <label htmlFor="security-question" className="sr-only">
              Security Question
            </label>
            <select
              id="security-question"
              name="security_question"
              ref={questionRef}
              required
              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a security question</option>
              {questions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="security-answer" className="sr-only">
              Security Answer
            </label>
            <input
              id="security-answer"
              name="security_answer"
              type="text"
              ref={answerRef}
              required
              className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Security Answer"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
            Signup
          </button>
        </div>
      </form>
      {err && <Navigate to="/" />}
    </div>
  );
}
