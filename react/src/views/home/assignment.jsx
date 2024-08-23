import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";

export default function Assignment({
  AssignmentId,
  lessonId,
  assignment_name,
  view,
  onClose,
}) {
  const [open, setOpen] = useState(view);
  const [questions, setQuestions] = useState([]);
  const [assignmentName, setAssignmentName] = useState(assignment_name);
  const { user } = useStateContext();
  const questionRefs = useRef([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, [AssignmentId]);

  useEffect(() => {
    if (view) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [view, AssignmentId]);

  const fetchQuestions = async () => {
    try {
      const response = await axiosClient.get(`question`, {
        params: { id: AssignmentId, questionType: "assignment" },
      });
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const handleClose = () => {
    setConfirmOpen(true);
    setActionType("close");
  };

  const handleAutoClose = () => {
    setOpen(false);
    onClose();
  };

  const handleConfirmClose = async () => {
    setConfirmOpen(false);
    await handlePostRequest();
    setOpen(false);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setConfirmOpen(true);
    setActionType("submit");
  };

  const handleConfirmSubmit = async () => {
    setConfirmOpen(false);
    await handlePostRequest();
    setResultOpen(true);

    // Close the result popup after 5 seconds and return to the lesson page
    setTimeout(() => {
      setResultOpen(false);
      handleAutoClose();
    }, 5000);
  };

  const handlePostRequest = async () => {
    let correct = 0;
    let wrong = 0;

    questions.forEach((question, qIndex) => {
      const selectedAnswer = document.querySelector(
        `input[name="question${qIndex}"]:checked`
      );
      if (selectedAnswer) {
        const answerId = parseInt(selectedAnswer.value);
        const correctAnswer = question.answers.find(
          (answer) => answer.isCorrect
        );
        if (correctAnswer && correctAnswer.id === answerId) {
          correct++;
        } else {
          wrong++;
        }
      } else {
        wrong++; // Count unanswered questions as wrong
      }
    });

    setCorrectAnswers(correct);
    setWrongAnswers(wrong);
    setSubmitted(true);

    // Send the result to the grade post request
    try {
      const response = await axiosClient.post("grade", {
        user_id: user.id,
        lesson_id: lessonId,
        id_of_type: AssignmentId,
        type: "assignment",
        grade: calculatePercentage(correct, questions.length),
      });
      console.log("Grade submitted successfully:", response.data);
    } catch (error) {
      console.error("Failed to submit grade:", error);
    }
  };

  const calculatePercentage = (correct, total) => {
    return total === 0 ? 0 : ((correct / total) * 100).toFixed(2);
  };

  const handleQuestionClick = (index) => {
    questionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <React.Fragment>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Assignment Details
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <main className="container mx-auto p-8">
            <div className="bg-white p-8 shadow-md rounded-lg flex space-x-8">
              <div className="w-3/4">
                <h1 className="text-2xl font-bold mb-6">{assignmentName}</h1>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="mb-4"
                        ref={(el) => (questionRefs.current[qIndex] = el)}
                      >
                        <h2 className="text-xl font-semibold mb-2">
                          {question.questionText}
                        </h2>
                        <div className="space-y-2">
                          {question.answers.map((answer, aIndex) => (
                            <div
                              key={aIndex}
                              className="p-4 border rounded flex items-center cursor-pointer"
                              onClick={() => {
                                const radio = document.getElementById(
                                  `question${qIndex}_option${aIndex}`
                                );
                                radio.checked = true;
                              }}
                            >
                              <input
                                type="radio"
                                id={`question${qIndex}_option${aIndex}`}
                                name={`question${qIndex}`}
                                value={answer.id}
                                className="mr-4"
                              />
                              <label
                                htmlFor={`question${qIndex}_option${aIndex}`}
                                className="text-gray-700"
                              >
                                {answer.AnswerText}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Submit Answer
                  </button>
                </form>
              </div>
              <div className="w-1/4">
                <div className="sticky top-0">
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <button
                        key={index}
                        className="block w-full text-left p-2 bg-gray-100 rounded"
                        onClick={() => handleQuestionClick(index)}
                      >
                        Assignment Question {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </DialogContent>
      </Dialog>
      <Dialog open={resultOpen} onClose={() => setResultOpen(false)}>
        <DialogContent>
          <Typography variant="h6" component="div">
            Assignment Results
          </Typography>
          <Typography variant="body1">
            Correct Answers: {correctAnswers}
          </Typography>
          <Typography variant="body1">Wrong Answers: {wrongAnswers}</Typography>
          <Typography variant="body1">
            Percentage: {calculatePercentage(correctAnswers, questions.length)}%
          </Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{"Confirm Action"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {actionType === "submit"
              ? "submit the assignment"
              : "close the assignment"}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={
              actionType === "submit" ? handleConfirmSubmit : handleConfirmClose
            }
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
