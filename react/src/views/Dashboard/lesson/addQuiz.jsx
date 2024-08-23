import React, { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";
import VideoPlayer from "./videoPlayer";
import Quiz from "./Quiz";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddQuiz() {
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [quiz, setQuiz] = useState({
    lesson_id: location.state.lessonId,
    name: "",
    isActive: true,
    timer: "", // Added timer field
  });

  const [errors, setErrors] = useState({});
  const [err, setErr] = useState(true);

  const onSubmit = (ev) => {
    ev.preventDefault();
    console.log(quiz);

    if (quiz.isActive === "on") {
      quiz.isActive = true;
    } else if (quiz.isActive === "off") {
      quiz.isActive = false;
    }

    axiosClient
      .post("/quiz", quiz)
      .then(({ data }) => {
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

    setOpen(false);
  };

  return (
    <div>
      <div className="text-right mr-5 mx-1 my-4 text-sm capitalize">
        <Button
          onClick={() => {
            setOpen(true);
          }}
          color="primary"
          variant="contained"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mx-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          ADD Quiz
        </Button>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Quiz Name{" "}
            <IconButton
              onClick={() => {
                setOpen(false);
              }}
              style={{ float: "right" }}
            >
              <CloseIcon color="primary" />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} margin={2}>
              <TextField
                variant="outlined"
                label="Quiz name"
                onChange={(ev) => setQuiz({ ...quiz, name: ev.target.value })}
              />
              <TextField
                variant="outlined"
                label="Timer (in minutes)"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(ev) => setQuiz({ ...quiz, timer: ev.target.value })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    color="primary"
                    onChange={(ev) =>
                      setQuiz({ ...quiz, isActive: ev.target.checked })
                    }
                  />
                }
                label="Active"
              />
              <Button color="primary" variant="contained" onClick={onSubmit}>
                Submit
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
