import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Box, TextField, Button, Typography } from '@mui/material';

function ReportForm() {
  const [reportData, setReportData] = useState({
    id: null,
    titulo: '',
    titulo_2: '',
    parrafo: '',
    expedicion: '',
    tamano_letra_titulo: '',
    tamano_letra_titulo_2: '',
    tamano_letra_parrafo: '',
    tamano_letra_expedicion: '',
    margen_izquierdo: '',
    margen_derecho: '',
    margen_superior: '',
    margen_inferior: '',
    tamano_hoja: 'carta',
    estilo_letra_titulo: '',
    estilo_letra_titulo_2: '',
    estilo_parrafo: '',
    estilo_expedicion: '',
  });

  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get('/api/reports')
      .then(response => setReports(response.data))
      .catch(error => console.error('Error al cargar reportes:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = reportData.id ? 'put' : 'post';
    const url = reportData.id ? `/api/reports/${reportData.id}` : '/api/reports';

    axios[method](url, reportData)
      .then(response => {
        if (method === 'put') {
          setReports(reports.map(report => (report.id === reportData.id ? response.data.data : report)));
        } else {
          setReports([...reports, response.data.data]);
        }
        setReportData({
          id: null,
          titulo: '',
          titulo_2: '',
          parrafo: '',
          expedicion: '',
          tamano_letra_titulo: '',
          tamano_letra_titulo_2: '',
          tamano_letra_parrafo: '',
          tamano_letra_expedicion: '',
          margen_izquierdo: '',
          margen_derecho: '',
          margen_superior: '',
          margen_inferior: '',
          tamano_hoja: 'carta',
          estilo_letra_titulo: '',
          estilo_letra_titulo_2: '',
          estilo_parrafo: '',
          estilo_expedicion: '',
        });
      })
      .catch(error => console.error('Error al guardar reporte:', error));
  };

  const handleEdit = (report) => {
    setReportData(report);
  };

  const handleDelete = (id) => {
    axios.delete(`/api/reports/${id}`)
      .then(() => {
        setReports(reports.filter(report => report.id !== id));
      })
      .catch(error => console.error('Error al eliminar reporte:', error));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Configuración de Reportes
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Inputs generados dinámicamente */}
          {Object.keys(reportData).filter(key => key !== 'id').map((key) => (
            <Grid item xs={12} md={6} key={key}>
              <TextField
                label={key.replace(/_/g, ' ')}
                fullWidth
                name={key}
                value={reportData[key]}
                onChange={handleChange}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" type="submit">
              {reportData.id ? 'Actualizar Reporte' : 'Crear Reporte'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Listado de reportes */}
      <Box mt={4}>
        <Typography variant="h5">Listado de Reportes</Typography>
        <ul>
          {reports.map((report) => (
            <li key={report.id}>
              {report.titulo}
              <Button onClick={() => handleEdit(report)}>Editar</Button>
              <Button onClick={() => handleDelete(report.id)}>Eliminar</Button>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}

export default ReportForm;
