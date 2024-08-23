import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import validator from "validator";
import axiosClient from "../../../axios";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import {
  Player,
  Video,
  DefaultUi,
  Control,
  Controls,
  ControlGroup,
} from "@vime/react";
import "@vime/core/themes/default.css";

export default function AddLesson() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [txtname, setName] = useState("");
  const [price, setPrice] = useState("");
  const [txtdescription, setDescription] = useState("");
  const [fileimage, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTimeLeft, setUploadTimeLeft] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Track which fields have been modified
  const [modifiedFields, setModifiedFields] = useState({});

  let playerRef = React.createRef();

  useEffect(() => {
    if (location.state?.lessonId) {
      const fetchLesson = async () => {
        try {
          const response = await axiosClient.get(`/viewLesson`, {
            params: { id: location.state.lessonId },
          });
          const lessonData = response.data.lessons?.[0];
          setLesson(lessonData);
          setName(lessonData.name || "");
          setPrice(lessonData.price || "");
          setDescription(lessonData.description || "");
        } catch (error) {
          setMessage("Failed to fetch lesson data.");
        }
      };
      fetchLesson();
    }
  }, [location.state?.lessonId]);

  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const validateInput = (input) => {
    const invalidPatterns = [
      /<script.*?>.*?<\/script>/gi,
      /<.*?on\w+.*?=.*?>/gi,
      /[<>]/g,
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /(;|\|)/g,
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|CAST|DECLARE|NVARCHAR|CHAR|CONVERT|TABLE|FROM|WHERE|AND|OR|LIMIT|OFFSET|HAVING|NULL|IS NULL|IS NOT NULL)\b/gi,
    ];

    for (let pattern of invalidPatterns) {
      if (pattern.test(input)) {
        return false;
      }
    }

    return validator.isAscii(input);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // 5GB limit
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;

    if (file && file.size > MAX_FILE_SIZE) {
      setMessage("File size exceeds 5GB limit.");
      e.target.value = null;
      setPhoto(null);
    } else {
      setPhoto(file);
      setModifiedFields((prev) => ({ ...prev, video_path: file })); // Track the change
    }
  };

  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    setModifiedFields((prev) => ({ ...prev, [field]: e.target.value })); // Track the change
  };

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

  const uploadProduct = async () => {
    if (
      Object.keys(modifiedFields).length === 0 ||
      !validateInput(txtname) ||
      !validateInput(txtdescription) ||
      !validateInput(price.toString())
    ) {
      setMessage("All fields are required and must be valid.");
      return;
    }

    const formData = new FormData();
    Object.entries(modifiedFields).forEach(([key, value]) => {
      formData.append(key, sanitizeInput(value));
    });
    formData.append("course_id", location.state.courseId);

    const startTime = Date.now();
    setIsUploading(true);

    try {
      const response = await axiosClient.post(
        `/upt_lesson/${lesson.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);

            const elapsedTime = Date.now() - startTime;
            const estimatedTotalTime = (elapsedTime / percentCompleted) * 100;
            const timeLeft = Math.round(
              (estimatedTotalTime - elapsedTime) / 1000
            );

            setUploadTimeLeft(timeLeft);
          },
        }
      );

      if (response) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/dashboard/myCourse/lessons", {
            state: { courseId: location.state.courseId },
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      setMessage("Failed to upload product.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadProduct();
  };

  console.log(lesson);

  return (
    <Box p={2}>
      <Typography variant="h4" component="h2" gutterBottom>
        {lesson ? "Update Lesson" : "Add New Lesson"}
      </Typography>
      <h2>{location.state.lessonName}</h2>
      {lesson && (
        <div class=" card left-3/4">
          <div class="header">
            <div class="image">
              <svg
                aria-hidden="true"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                ></path>
              </svg>
            </div>
            <div class="content">
              <span class="title">Video warning </span>
              <p class="message">
                you can edit the price and lesson name and description of the
                lesson but you can't update the video <br />
                you can delete the holl lesson and upload the new lesson with
                the new video
              </p>
            </div>
          </div>
        </div>
      )}

      {lesson && (
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
      )}

      <Typography color="error">{message}</Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Lesson Title"
              variant="outlined"
              fullWidth
              value={txtname}
              onChange={handleInputChange(setName, "name")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              value={price}
              onChange={handleInputChange(setPrice, "price")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={txtdescription}
              onChange={handleInputChange(setDescription, "description")}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {uploadProgress > 0 && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                />
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  {`${uploadProgress}% (${uploadTimeLeft}s left)`}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isUploading}
            >
              {lesson ? "Update Lesson" : "Add Lesson"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
