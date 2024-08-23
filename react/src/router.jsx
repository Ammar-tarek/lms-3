import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Signup from "./views/signup";
import Login from "./views/login";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard/dashboard";
import MyCourses from "./views/Dashboard/myCourses";
import NewCourse from "./views/Dashboard/newCourse";
import NewCourseee from "./views/Dashboard/newCourse copy";
import Categories from "./views/Dashboard/categories";
import NewCategory from "./views/Dashboard/newCategory";
import Lessons from "./views/Dashboard/lesson";
import QuizDetails from "./views/Dashboard/lesson/questionsDetails";
import AddLesson from "./views/Dashboard/lesson/addLesson";
import ViewLesson from "./views/Dashboard/lesson/viewLesson";
import Students from "./views/Dashboard/students";
import DashboardLayout from "./components/DashboardLayout";
import Instructor from "./views/home/instructor";
import Profile from "./views/Dashboard/profile";
import Course from "./views/home/course";
import Lesson from "./views/home/lesson";
import UserProfile from "./views/home/profile";
import ForgotPassword from "./views/forgotPassword";
import ResetPassword from "./views/reset-password";
// import Wallet from "./views/home/profile/wallet";
import UserLayout from "./components/UserLayout";
import Students_lesson from "./views/Dashboard/lesson/students";
import St_Quiz from "./views/home/Quiz";
import RandomString from "./views/Dashboard/RandomString";
import Wallet from "./views/Dashboard/wallet";
import ViewedLessons from "./views/Dashboard/lesson/viewedLessons";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/instructor/course/lesson/",
        element: <Lesson />,
      },

      {
        path: "/instructor",
        element: <Instructor />,
      },
      {
        path: "/instructor/course",
        element: <Course />,
      },
      {
        path: "/instructor/:id/lesson/:id/quiz/:id",
        element: <St_Quiz />,
      },

      // {
      //   path: "/instructor/:id/lesson/:id/quiz/:id",
      //   element: <St_Quiz />,
      // },
    ],
  },

  {
    path: "/Profile",
    element: <UserProfile />,
    children: [
      {
        path: "/Profile/wallet",
        element: <Wallet />,
      },
    ],
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },

  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/RandomString",
        element: <RandomString />,
      },
      {
        path: "/dashboard/wallet",
        element: <Wallet />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },

      {
        path: "/dashboard/myCourses",
        element: <MyCourses />,
      },
      {
        path: "/dashboard/students",
        element: <Students />,
      },
      {
        path: "/dashboard/students/lessons",
        element: <ViewedLessons />,
      },
      {
        path: "/dashboard/student/wallet",
        element: <Wallet />,
      },

      {
        path: "/dashboard/newCourse",
        element: <NewCourse />,
      },

      // there is logic error here
      {
        path: "/dashboard/myCourse/:id",
        element: <NewCourse />,
      },

      {
        path: "/dashboard/categories",
        element: <Categories />,
      },
      {
        path: "/dashboard/newCategory",
        element: <NewCategory />,
      },
      {
        path: "/dashboard/newCategory/:id",
        element: <NewCategory />,
      },
      {
        path: "/dashboard/test",
        element: <NewCourseee />,
      },
      {
        path: "/dashboard/myCourse/lessons",
        element: <Lessons />,
      },
      // {
      //   path: "/dashboard/myCourse/:id/lessons",
      //   element: <Lessons />,
      // },
      {
        path: "/dashboard/myCourse/lesson/addLesson",
        element: <AddLesson />,
      },
      {
        path: "/dashboard/myCourse/lesson/students",
        element: <Students_lesson />,
      },
      // {
      //   path: "/dashboard/myCourse/:id/lesson/:id/students",
      //   element: <Students_lesson />,
      // },
      {
        path: "/dashboard/myCourse/lesson/viewLesson",
        element: <ViewLesson />,
      },
      // {
      //   path: "/dashboard/myCourse/:id/lesson/:id/viewLesson",
      //   element: <ViewLesson />,
      // },
      {
        path: "/dashboard/myCourse/lesson/viewLesson/QuizDetails",
        element: <QuizDetails />,
      },
      // {
      //   path: "/dashboard/myCourse/:id/lesson/:id/viewLesson/:id/QuizDetails",
      //   element: <QuizDetails />,
      // },
    ],
  },

  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
