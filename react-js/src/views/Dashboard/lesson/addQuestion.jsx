import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import AddCircleOutlineTwoToneIcon from "@mui/icons-material/AddCircleOutlineTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosClient from "../../../axios";

export default function AddQuestion({ id, view, questionType }) {
  const [open, setOpen] = useState(view);
  const [questions, setQuestions] = useState([
    {
      quiz_id: id,
      questionText: "",
      options: [{ text: "", correct: false }],
      hasError: false, // Added error state
    },
  ]);

  const handleClose = () => setOpen(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        quiz_id: id,
        questionText: "",
        options: [{ text: "", correct: false }],
        hasError: false,
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", correct: false });
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((option, i) => {
      option.correct = i === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    // Validate that each question has exactly one correct answer
    let hasErrors = false;
    const updatedQuestions = questions.map((question) => {
      const correctAnswers = question.options.filter(
        (option) => option.correct
      );
      if (correctAnswers.length !== 1) {
        hasErrors = true;
        return { ...question, hasError: true };
      }
      return { ...question, hasError: false };
    });

    if (hasErrors) {
      setQuestions(updatedQuestions);
      return;
    }

    try {
      const questionsToSubmit = updatedQuestions.map((question) => ({
        ...question,
        questionType: questionType, // Use the passed question type
      }));

      const responses = await Promise.all(
        questionsToSubmit.map((question) =>
          axiosClient.post("/question", question)
        )
      );
      console.log("Questions submitted:", responses);
      // Close the dialog after successful submission
      handleClose();
    } catch (err) {
      console.error("Error submitting questions:", err);
      // Handle error, e.g., show error message
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
              Add Questions
            </Typography>
            <Button autoFocus color="inherit" onClick={onSubmit}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Stack spacing={2} margin={2}>
            {questions.map((question, qIndex) => (
              <Stack key={qIndex} spacing={2}>
                {question.hasError && (
                  <Typography color="error">
                    Each question must have exactly one correct answer.
                  </Typography>
                )}
                <TextField
                  variant="outlined"
                  label="Question"
                  value={question.questionText}
                  onChange={(event) => handleQuestionChange(qIndex, event)}
                  error={question.hasError}
                  helperText={
                    question.hasError
                      ? "This question needs a correct answer"
                      : ""
                  }
                />
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center">
                    <TextField
                      className="flex-grow"
                      label={`Option ${oIndex + 1}`}
                      value={option.text}
                      onChange={(event) =>
                        handleOptionChange(qIndex, oIndex, event)
                      }
                    />
                    <Checkbox
                      checked={option.correct}
                      onChange={() => handleCorrectChange(qIndex, oIndex)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <IconButton
                      onClick={() => handleDeleteOption(qIndex, oIndex)}
                      aria-label="delete"
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  onClick={() => handleAddOption(qIndex)}
                  startIcon={<AddCircleOutlineTwoToneIcon />}
                >
                  Add Option
                </Button>
                {questions.length > 1 && (
                  <IconButton
                    onClick={() => handleDeleteQuestion(qIndex)}
                    aria-label="delete question"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
            <Button onClick={handleAddQuestion} variant="contained">
              Add Another Question
            </Button>
            <Button onClick={onSubmit} variant="contained" color="primary">
              Submit All Questions
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
