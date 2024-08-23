import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axiosClient from "../../../axios";

export default function ViewedLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axiosClient.get("/viewedlessons", {
          params: { user_id: 2 },
        });

        if (response.data.lessons && response.data.lessons.length > 0) {
          setLessons(response.data.lessons);
        } else {
          setError("No lessons found");
        }
      } catch (error) {
        setError("Failed to fetch lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box m={2}>
      <TableContainer component={Paper} className="m-3">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lesson Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Quizzes Grades</TableCell>
              <TableCell>Assignments Grades</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map((lesson) => {
              // Collect quizzes grades
              const quizGrades = lesson.grades
                .filter((grade) => grade.type === "quiz")
                .map((grade) => `${grade.grade} (${grade.graded_date})`)
                .join(", ");

              // Collect assignments grades
              const assignmentGrades = lesson.grades
                .filter((grade) => grade.type === "assignment")
                .map((grade) => `${grade.grade} (${grade.graded_date})`)
                .join(", ");

              return (
                <TableRow key={lesson.id}>
                  <TableCell>{lesson.name}</TableCell>
                  <TableCell>{lesson.price}</TableCell>
                  <TableCell>{lesson.payment.payment_date}</TableCell>
                  <TableCell>{quizGrades || "N/A"}</TableCell>
                  <TableCell>{assignmentGrades || "N/A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
