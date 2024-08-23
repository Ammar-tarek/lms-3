import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import axiosClient from "../../../axios";

export default function QuizDetails({ id, view, questionType }) {
  const [open, setOpen] = useState(view);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, [id, questionType]);

  const fetchQuestions = async () => {
    try {
      const response = await axiosClient.get(`question`, {
        params: { id: id, questionType: questionType },
      });
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShowAddQuestion(false);
    console.log(showAddQuestion);
  }; // Reset state

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axiosClient.delete(`delQuestion`, {
        params: { id: questionId },
      });
      fetchQuestions(); // Fetch updated data after deletion
    } catch (error) {
      console.error("Failed to delete question", error);
    }
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
              Quiz Details
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">General Knowledge Quiz</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Select the correct answer for each question.
              </p>
            </div>

            <div className="space-y-8">
              {questions.length > 0 ? (
                questions.map((question, qIndex) => (
                  <div key={qIndex} className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {qIndex + 1}. {question.questionText}
                      </h2>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        {question.answers &&
                          question.answers.map((option, oIndex) => {
                            if (option.isCorrect === 0) {
                              return (
                                <div
                                  key={oIndex}
                                  className="p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-red-500 hover:text-white active:bg-red-600"
                                  onClick={() =>
                                    console.log(
                                      `Option ${
                                        oIndex + 1
                                      } selected for question ${qIndex + 1}`
                                    )
                                  } // Example of adding interactivity
                                >
                                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {option.AnswerText}
                                  </label>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  key={oIndex}
                                  className="p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-blue-100 active:bg-blue-200"
                                  onClick={() =>
                                    console.log(
                                      `Option ${
                                        oIndex + 1
                                      } selected for question ${qIndex + 1}`
                                    )
                                  } // Example of adding interactivity
                                >
                                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {option.AnswerText}
                                  </label>
                                </div>
                              );
                            }
                          })}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800"></div>
                    <div className="flex justify-end items-center space-x-4">
                      <button
                        className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        Delete Question
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No questions found.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
