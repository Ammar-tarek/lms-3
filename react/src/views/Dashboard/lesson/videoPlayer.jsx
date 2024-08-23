import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoPlayer = ({ filename }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/viewLesson/${filename}`, {
          responseType: "blob", // Expecting a binary response
        });

        if (response.data.size > 0) {
          const videoBlob = new Blob([response.data], { type: "video/mp4" });
          const url = URL.createObjectURL(videoBlob);
          setVideoUrl(url);
        } else {
          throw new Error("Empty video file received");
        }
      } catch (error) {
        setError(`Error fetching video: ${error.message}`);
      }
    };
    console.log(filename);

    if (filename) {
      fetchVideo();
    }
    // Cleanup function to revoke the object URL
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [filename]);

  // Handle error display
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {videoUrl && (
        // <video controls>
        //   <source src={videoUrl} type="video/mp4" />
        //   Your browser does not support the video tag.
        // </video>
        <div class="ratio ratio-16x9">
          <iframe src="videoUrl" title="YouTube video" allowfullscreen></iframe>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import axiosClient from "../../../axios";
// import VideoPlayer from "./videoPlayer";
// import Quiz from "./Quiz";
// import {
//   Button,
//   Checkbox,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   IconButton,
//   Stack,
//   TextField,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// export default function quizDetails({ id }) {
//   const [openn, opennchange] = useState(false);
//   console.log(id);

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         // const res = await axiosClient.get(`quiz`, { params: { id: id } });
//         // if (res.data.length > 0) {
//         //   setQuiz(res.data[0]); // Correctly call setQuiz to update the state with the first quiz
//         // }
//         console.log("error");
//       } catch (err) {
//         console.log(err);
//         // setQuiz(null); // Handle error by resetting quiz state or setting it to a meaningful error state
//       }
//     };

//     fetchQuizzes();
//   }, [id]);

//   const onSubmit = (ev) => {
//     ev.preventDefault();
//     axiosClient
//       .post("/question", question)
//       .then(({ data }) => {
//         setErr(true);
//         console.log(data);
//         // console.log(course)
//         opennchange(false);
//       })
//       .catch((err) => {
//         const response = err.response;
//         if (response && response.status === 422) {
//           setErrors(response.data.errors);
//           setErr(false);
//         }
//       });
//   };
//   const [question, setQuestion] = useState({
//     quiz_id: id,
//     name: "",
//   });

//   return (
//     <div>
//       <div className="text-right mr-5 mx-1 text-sm capitalize">
//         <Dialog
//           fullScreen
//           open={open}
//           onClose={() => {
//             opennchange(false);
//           }}
//           fullWidth
//           maxWidth="sm"
//         >
//           <DialogTitle>
//             Questions{" "}
//             <IconButton
//               onClick={() => {
//                 opennchange(false);
//               }}
//               style={{ float: "right" }}
//             >
//               {/* <CloseIcon color="primary"></CloseIcon> */}
//             </IconButton>{" "}
//           </DialogTitle>
//           <DialogContent>
//             <Stack spacing={2} margin={2}>
//               <TextField
//                 variant="outlined"
//                 label="question"
//                 onChange={(ev) =>
//                   setQuestion({ ...question, name: ev.target.value })
//                 }
//               ></TextField>
//               <Button color="primary" variant="contained" onClick={onSubmit}>
//                 Submit
//               </Button>
//             </Stack>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }
