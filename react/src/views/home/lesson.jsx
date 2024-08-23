import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Quiz from "./Quiz";
import Assignment from "./assignment";
import {
  Player,
  Video,
  DefaultUi,
  Control,
  Controls,
  ControlGroup,
} from "@vime/react";
import "@vime/core/themes/default.css";

export default function Lesson() {
  const { id } = useParams();
  const { user } = useStateContext();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [showAssignmentDetails, setShowAssignmentDetails] = useState(false);
  const location = useLocation();

  let playerRef = React.createRef();

  useEffect(() => {
    fetchLessonData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (playerRef.current) {
        const player = playerRef.current;
        switch (event.key) {
          case "ArrowLeft":
            player.currentTime = Math.max(player.currentTime - 10, 0);
            break;
          case "ArrowRight":
            player.currentTime = Math.min(
              player.currentTime + 10,
              player.duration
            );
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerRef]);

  const fetchLessonData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(`/lesson`, {
        params: { id: location.state.lessonId, user_id: user.id },
      });
      setLesson(data?.lessons?.[0]);
    } catch (error) {
      console.error("Failed to fetch questions", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuiz = () => {
    setShowQuizDetails(true);
  };

  const handleCloseQuiz = () => {
    setShowQuizDetails(false);
    fetchLessonData(); // Reload lesson data to get updated grades
  };

  const handleViewAssignment = () => {
    setShowAssignmentDetails(true);
  };

  const handleCloseAssignment = () => {
    setShowAssignmentDetails(false);
    fetchLessonData(); // Reload lesson data to get updated grades
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
    <div>
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">{lesson.name}</h2>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Chapter 10 - Gênero Textual Reportagem
              </h3>
              <div className="mb-6">
                <Player ref={playerRef}>
                  <Video>
                    <source
                      src={`http://localhost:8000/videos/${lesson.video_path}`}
                      type="video/mp4"
                    />
                  </Video>
                  <DefaultUi />
                  <Controls pin="center">
                    <ControlGroup>
                      <Control name="play" />
                      <Control name="volume" />
                      <Control name="mute" />
                      <Control name="fullscreen" />
                      <Control name="pip" />
                      <Control name="settings" />
                      <Control name="subtitles" />
                      <Control name="playbackrate" />
                      <Control name="chapters" />
                      <Control name="seekback" seconds={10} />
                      <Control name="seekforward" seconds={10} />
                    </ControlGroup>
                  </Controls>
                </Player>
              </div>
              <div className="mb-4">
                <button
                  onClick={handleViewAssignment}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Assignment
                </button>
                <button
                  onClick={handleViewQuiz}
                  className="bg-red-200 text-gray-700 px-4 py-2 rounded-lg ml-2"
                  disabled={lesson.grades?.some(
                    (grade) => grade.type === "quiz"
                  )} // Disable the button if the user has a quiz grade
                >
                  Quiz
                </button>
              </div>
              {lesson.grades?.some((grade) => grade.type === "quiz") && (
                <div className="mb-4">
                  <h4 className="text-lg font-bold">
                    Your Quiz Grade:{" "}
                    {
                      lesson.grades.filter((grade) => grade.type === "quiz")[0]
                        .grade
                    }
                  </h4>
                </div>
              )}
              <p className="text-gray-700 mb-4">{lesson.description}</p>
            </div>
            <div>
              {/* History of records for assignments */}
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-bold mb-4">
                  Assignment Grades History
                </h3>
                {lesson.grades?.filter((grade) => grade.type === "assignment")
                  .length > 0 ? (
                  <ul className="space-y-4">
                    {lesson.grades
                      .filter((grade) => grade.type === "assignment")
                      .map((grade, index) => (
                        <li
                          key={index}
                          className="bg-blue-200 text-gray-700 p-4 rounded-lg"
                        >
                          <h4 className="font-bold">Grade: {grade.grade}</h4>
                          <p>
                            Date: {new Date(grade.graded_date).toLocaleString()}
                          </p>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>No assignment grades available.</p>
                )}
              </div>
              {/* Latest quiz grade */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Latest Quiz Grade</h3>
                {lesson.grades?.filter((grade) => grade.type === "quiz")
                  .length > 0 ? (
                  <div className="bg-blue-200 text-gray-700 p-4 rounded-lg">
                    <h4 className="font-bold">
                      Grade:{" "}
                      {
                        lesson.grades.filter(
                          (grade) => grade.type === "quiz"
                        )[0].grade
                      }
                    </h4>
                    <p>
                      Date:{" "}
                      {new Date(
                        lesson.grades.filter(
                          (grade) => grade.type === "quiz"
                        )[0].graded_date
                      ).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p>No quiz grades available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuizDetails && (
        <Quiz
          QuizId={lesson.quizzes?.[0]?.id}
          lessonId={lesson.id}
          quiz_name={lesson.quizzes?.[0]?.quiz_name}
          view={showQuizDetails}
          onClose={handleCloseQuiz}
        />
      )}
      {showAssignmentDetails && (
        <Assignment
          lessonId={lesson.id}
          AssignmentId={lesson.assignments?.[0]?.id}
          assignment_name={lesson.assignments?.[0]?.assignment_name}
          view={showAssignmentDetails}
          onClose={handleCloseAssignment}
        />
      )}
    </div>
  );
}
