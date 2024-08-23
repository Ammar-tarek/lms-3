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

  useEffect(() => {
    if (location.state?.lessonId) {
      const fetchLesson = async () => {
        try {
          const response = await axiosClient.get(`/viewLesson`, {
            params: { id: location.state.lessonId },
          });
          setLesson(response.data);
          setName(response.data.name || "");
          setPrice(response.data.price || "");
          setDescription(response.data.description || "");
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
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;

    if (file && file.size > MAX_FILE_SIZE) {
      setMessage("File size exceeds 5GB limit.");
      e.target.value = null;
      setPhoto(null);
    } else {
      setPhoto(file);
    }
  };

  const uploadProduct = async () => {
    if (
      !validateInput(txtname) ||
      !validateInput(txtdescription) ||
      !validateInput(price.toString()) ||
      !fileimage
    ) {
      setMessage("All fields are required and must be valid.");
      return;
    }

    const formData = new FormData();
    formData.append("name", sanitizeInput(txtname));
    formData.append("description", sanitizeInput(txtdescription));
    formData.append("image", fileimage);
    formData.append("price", sanitizeInput(price.toString()));
    formData.append("course_id", location.state.courseId);

    const startTime = Date.now();
    setIsUploading(true);

    try {
      const response = await axiosClient.post(
        `/viewLesson${lesson ? `/${lesson.id}` : ""}`,
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

  console.log(location.state);

  return (
    <Box p={2}>
      <Typography variant="h4" component="h2" gutterBottom>
        {lesson ? "Update Lesson" : "Add New Lesson"}
      </Typography>
      <Typography variant="h6" component="h4" gutterBottom>
        {location.state.lessonName}
      </Typography>

      {lesson && (
        <div className="mx-4 block mb-2">
          <video
            className="rounded-md"
            width={"920px"}
            height={"500px"}
            controls
          >
            <source src={`http://localhost:8000/videos/${lesson.video_path}`} />
          </video>
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
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0) {
                  setPrice(value);
                }
              }}
              inputProps={{ min: "0", step: "0.01" }}
              autoComplete="off"
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
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
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
                <Typography variant="caption">
                  {`${Math.round(uploadProgress)}%`}
                </Typography>
                {uploadTimeLeft !== null && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Estimated time left: {uploadTimeLeft} seconds
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isUploading}
            >
              {lesson ? "Update Lesson" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
