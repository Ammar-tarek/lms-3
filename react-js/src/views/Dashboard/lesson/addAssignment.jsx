import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../../axios";
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

export default function AddAssignment() {
  let { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // https://www.youtube.com/watch?v=bSvWR1iqXSg
  //https://github.com/nihira2020/reactmui/blob/master/src/Modalpopup.js
  const [open, openchange] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    console.log(assignment);
    if (assignment.isActive === "on") {
      setAssignment.isActive = true;
    } else if (assignment.isActive === "off") {
      setAssignment.isActive = false;
    }
    axiosClient
      .post("/assignment", assignment)
      .then(({ data }) => {
        setErr(true);
        console.log(data);
        // console.log(course)
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
          setErr(false);
        }
      });
    openchange(false);
  };

  const [assignment, setAssignment] = useState({
    lesson_id: location.state.lessonId,
    name: "",
    isActive: true,
  });
  //   console.log(assignment.name);

  return (
    <div>
      <div className="text-right mr-5 mx-1 text-sm capitalize">
        <Button
          onClick={() => {
            openchange(true);
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
          ADD Assignment
        </Button>
        <Dialog
          // fullScreen
          open={open}
          onClose={() => {
            openchange(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Assignment Name{" "}
            <IconButton
              onClick={() => {
                openchange(false);
              }}
              style={{ float: "right" }}
            >
              <CloseIcon color="primary"></CloseIcon>
            </IconButton>{" "}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} margin={2}>
              <TextField
                variant="outlined"
                label="Assignment name"
                onChange={(ev) =>
                  setAssignment({ ...assignment, name: ev.target.value })
                }
              ></TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    color="primary"
                    onChange={(ev) =>
                      setAssignment({
                        ...assignment,
                        isActive: ev.target.checked,
                      })
                    }
                  ></Checkbox>
                }
                label="Active"
              ></FormControlLabel>
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
