import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios";

const RandomString = () => {
  const [strings, setStrings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useStateContext({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false); // State to track select all checkbox
  const itemsPerPage = 50; // Adjust items per page as needed

  useEffect(() => {
    fetchRandomStrings();
  }, [currentPage, searchQuery]); // Only fetch data when currentPage or searchQuery changes

  const fetchRandomStrings = async () => {
    try {
      const response = await axiosClient.get("/RandomStrings", {
        params: {
          user_id: user.id,
          page: currentPage + 1,
          per_page: itemsPerPage,
          search: searchQuery || undefined,
        },
      });
      const { data, pagination } = response.data; // Destructure data and pagination from response
      const updatedStrings = data.map((str) => ({
        ...str,
        selected: strings.find((s) => s.id === str.id)?.selected || false,
      }));
      setStrings(updatedStrings);
      setTotalPages(pagination.last_page);
    } catch (error) {
      console.error("Error fetching random strings:", error);
    }
  };

  const generateRandomString = async () => {
    try {
      await axiosClient.post("/createRandomStrings", {
        CreatedFrom: user.id,
      });
      fetchRandomStrings(); // Refresh the list after generating new strings
    } catch (error) {
      console.error("Error generating random string:", error);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page - 1); // MUI Pagination starts counting from 1, so adjust to start from 0
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to the first page on search
  };

  const toggleSelectAll = () => {
    const updatedStrings = strings.map((str) => ({
      ...str,
      selected: !selectAll,
    }));
    setStrings(updatedStrings);
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    const updatedStrings = strings.map((str) =>
      str.id === id ? { ...str, selected: !str.selected } : str
    );
    setStrings(updatedStrings);
    setSelectAll(updatedStrings.every((str) => str.selected));
  };

  const handleCheckboxHeaderChange = () => {
    const allSelected = !selectAll;
    const updatedStrings = strings.map((str) => ({
      ...str,
      selected: allSelected,
    }));
    setStrings(updatedStrings);
    setSelectAll(allSelected);
  };

  const handlePrint = async () => {
    const selectedStrings = strings.filter((str) => str.selected);
    const printContent = selectedStrings
      .map(
        (str) => `
      Course Key: ${str.random_string}
    `
      )
      .join("\n\n");

    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(
      "<html><head><title>Print Selected Rows</title></head><body>"
    );
    printWindow.document.write("<pre>" + printContent + "</pre>");
    printWindow.document.write(
      `<button id="print-button">Print</button><script>document.getElementById('print-button').addEventListener('click', function() { window.print(); window.opener.updatePrintedStatus(${JSON.stringify(
        selectedStrings.map((str) => str.id)
      )}); window.close(); });</script>`
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();
  };

  const updatePrintedStatus = async (ids) => {
    try {
      await axiosClient.put("/updateStatus", {
        ids,
        status: "printed",
      });
      fetchRandomStrings(); // Refresh the list after updating the status
    } catch (error) {
      console.error("Error updating string status:", error);
    }
  };

  window.updatePrintedStatus = updatePrintedStatus; // Expose the function to the print window

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Random String Generator
      </Typography>
      <Box mb={4} display="flex" alignItems="center">
        <Button
          onClick={generateRandomString}
          variant="contained"
          color="primary"
          size="large"
        >
          Add Random String
        </Button>
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          margin="dense"
          placeholder="Search Random Strings (optional)"
          fullWidth
          sx={{ ml: 4 }}
        />
        <Button
          onClick={handlePrint}
          variant="contained"
          color="secondary"
          size="large"
          sx={{ ml: 4 }}
        >
          Print Selected Rows
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflow: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selectAll &&
                    strings.length > 0 &&
                    strings.every((str) => str.selected)
                  }
                  onChange={handleCheckboxHeaderChange}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Random String</TableCell>
              <TableCell>Used From</TableCell>
              <TableCell>Lesson Name</TableCell>
              <TableCell>Created From</TableCell>
              <TableCell>used_at</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {strings.map((str) => (
              <TableRow key={str.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={str.selected || false}
                    onChange={() => handleCheckboxChange(str.id)}
                  />
                </TableCell>
                <TableCell>{str.id}</TableCell>
                <TableCell>{str.random_string}</TableCell>
                <TableCell>{str.usedFrom || "N/A"}</TableCell>
                <TableCell>{str.lessonName || "N/A"}</TableCell>
                <TableCell>{str.CreatedFrom}</TableCell>
                <TableCell>{str.string_status}</TableCell>
                <TableCell>{str.used_at}</TableCell>
                <TableCell>{str.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage + 1} // MUI Pagination starts counting from 1, so adjust to start from 0
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default RandomString;
