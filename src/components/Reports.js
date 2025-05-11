import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Toolbar,
  Select,
  MenuItem,
  Button,
  useMediaQuery,
} from "@mui/material";

export default function EnhancedTable() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [employees, setEmployees] = useState([]);
  const [reportData, setReportData] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/reports").then((response) => setReports(response.data));
    axios.get("http://127.0.0.1:8000/api/addstaff").then((response) => setEmployees(response.data));
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = new Set(employees.map((n) => n.id));
      setSelected(newSelected);
      return;
    }
    setSelected(new Set());
  };

  const handleClick = (event, id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleReportSelect = (event) => {
    const reportId = event.target.value;
    setSelectedReport(reportId);
    axios.get(`http://127.0.0.1:8000/api/reports/${reportId}`).then((response) => setReportData(response.data));
  };

  const handlePrint = () => {
    if (selectedReport && selected.size > 0) {
      const employeeIds = Array.from(selected).join(";");
      const data = { report_id: selectedReport, employee_ids: employeeIds };
      axios
        .post("http://127.0.0.1:8000/api/certificados", data, { responseType: "blob" })
        .then((response) => {
          // Crear un enlace temporal para mostrar el PDF
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `reporte_${selectedReport}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error generando el PDF:", error);
          alert("Ocurrió un error al generar el reporte.");
        });
    } else {
      alert("Seleccione un reporte y al menos un empleado para imprimir.");
    }
  };
  

  return (
    <Box sx={{ width: "100%", padding: isMobile ? 1 : 3 }}>
      <Paper sx={{ width: "100%", mb: 2, p: isMobile ? 1 : 2 }}>
        <Typography variant="h6" gutterBottom>
          Seleccionar Reporte
        </Typography>
        <Select
          fullWidth
          value={selectedReport}
          onChange={handleReportSelect}
          displayEmpty
          inputProps={{ "aria-label": "Select Report" }}
        >
          <MenuItem value="" disabled>
            Seleccione un reporte
          </MenuItem>
          {reports.map((report) => (
            <MenuItem key={report.id} value={report.id}>
              {report.titulo}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{ mt: 2, width: "100%" }}
          disabled={!selectedReport || selected.size === 0}
        >
          Imprimir
        </Button>
      </Paper>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar>
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle">
            Empleados
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.size > 0 && selected.size < employees.length}
                    checked={employees.length > 0 && selected.size === employees.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Municipio</TableCell>
                <TableCell>Departamento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, employee.id)}
                  role="checkbox"
                  aria-checked={selected.has(employee.id)}
                  tabIndex={-1}
                  key={employee.id}
                  selected={selected.has(employee.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={selected.has(employee.id)} />
                  </TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.apellidos}</TableCell>
                  <TableCell>{employee.cargo}</TableCell>
                  <TableCell>{employee.municipio_expedicion}</TableCell>
                  <TableCell>{employee.departamento_expedicion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </Paper>
    </Box>
  );
}
