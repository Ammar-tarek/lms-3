import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AddQuiz from "./addQuiz";
import QuizDetails from "./questionsDetails";
import AddQuestion from "./addQuestion";
import AddAssignment from "./addAssignment";

export default function ViewLesson() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState();
  const [quiz, setQuiz] = useState();
  const [assignment, setAssignment] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [questionType, setQuestionType] = useState(""); // Added state for question type

  useEffect(() => {
    fetchLessonData();
  }, [id]); // Added 'id' as a dependency to re-fetch when 'id' changes

  const fetchLessonData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(`/viewLesson`, {
        params: { id: location.state.lessonId },
      });
      if (data?.lessons?.[0]) {
        setLesson(data.lessons[0]);
        if (data.lessons[0].quizzes) {
          setQuiz(data.lessons[0].quizzes[0]); // Assuming you want the first quiz
        }
        if (data.lessons[0].assignments) {
          setAssignment(data.lessons[0].assignments[0]); // Assuming you want the first assignment
        }
      }
    } catch (error) {
      console.error("Failed to fetch lesson data", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (type) => {
    setShowQuizDetails(true);
    setShowAddQuestion(false); // Reset state
    setQuestionType(type); // Set question type based on the button clicked
  };

  const handleAddQuestions = (type) => {
    setShowAddQuestion(true);
    setShowQuizDetails(false); // Reset state
    setQuestionType(type); // Set question type based on the button clicked
  };

  const handleAddQuizClose = () => {
    setShowAddQuiz(false);
    fetchLessonData(); // Reload data
  };

  const handleAddAssignmentClose = () => {
    setShowAddAssignment(false);
    fetchLessonData(); // Reload data
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!lesson) {
    return <div>No data available</div>;
  }

  return (
    <div className="container my-2">
      <h1 className="content-center justify-center">{lesson.name}</h1>
      {lesson && (
        <div className="block content-center">
          <video
            className="rounded-md"
            width={"820px"}
            height={"500px"}
            controls
          >
            <source src={`http://localhost:8000/videos/${lesson.video_path}`} />
          </video>
        </div>
      )}
      {!quiz && <AddQuiz onClose={handleAddQuizClose} />}
      {!assignment && <AddAssignment onClose={handleAddAssignmentClose} />}
      {quiz && (
        <div className="p-6 border marker:border-spacing-4 w-64 m-10">
          <div className="flex items-center gap-4">
            <div className="!w-56">
              <h2 className="text-lg font-semibold">{quiz.quiz_name}</h2>
            </div>
            <button
              className="text-sm font-medium"
              onClick={() => handleView("quiz")}
            >
              View
            </button>
            <button
              className="text-sm font-medium w-full"
              onClick={() => handleAddQuestions("quiz")}
            >
              Add Questions
            </button>
          </div>
        </div>
      )}
      {assignment && (
        <div className="p-6 border marker:border-spacing-4 w-64 m-10">
          <div className="flex items-center gap-4">
            <div className="!w-56">
              <h2 className="text-lg font-semibold">
                {assignment.assignment_name}
              </h2>
            </div>
            <button
              className="text-sm font-medium"
              onClick={() => handleView("assignment")}
            >
              View
            </button>
            <button
              className="text-sm font-medium w-full"
              onClick={() => handleAddQuestions("assignment")}
            >
              Add Questions
            </button>
          </div>
        </div>
      )}
      {showAddQuestion && (
        <AddQuestion
          id={questionType === "quiz" ? quiz.id : assignment.id}
          view={true}
          questionType={questionType}
        />
      )}
      {showQuizDetails && (
        <QuizDetails
          id={questionType === "quiz" ? quiz.id : assignment.id}
          view={true}
          questionType={questionType}
        />
      )}
    </div>
  );
}
