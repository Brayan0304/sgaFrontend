import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Box, TextField, Button, Typography } from '@mui/material';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// API functions
const fetchReports = async () => {
  try {
    const resp = await api.get('reports');
    return resp.data;
  } catch (error) {
    console.error('fetchReports error:', error.response?.data ?? error.message);
    throw error;
  }
};

const addReport = async (reportData) => {
  try {
    // Enviar sólo los campos necesarios (quita id si existe)
    const payload = { ...reportData };
    delete payload.id;

    const resp = await api.post('reports', payload);
    return resp.data ?? resp;
  } catch (error) {
    // Mostrar errores de validación que devuelve el backend
    console.error('addReport error:', error.response?.data ?? error.message);
    // Re-lanzar para que el caller pueda manejarlo
    throw error;
  }
};

const updateReport = async (id, reportData) => {
  try {
    const payload = { ...reportData };
    delete payload.id;

    const resp = await api.put(`reports/${id}`, payload);
    return resp.data ?? resp;
  } catch (error) {
    console.error('updateReport error:', error.response?.data ?? error.message);
    throw error;
  }
};

const deleteReport = async (id) => {
  try {
    await api.delete(`reports/${id}`);
  } catch (error) {
    console.error('deleteReport error:', error.response?.data ?? error.message);
    throw error;
  }
};

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
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const data = await fetchReports();
      setReports(Array.isArray(data) ? data : data.data ?? []);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reportData.id) {
        const resp = await updateReport(reportData.id, reportData);
        const updated = resp.data ?? resp;
        setReports(reports.map(r => (r.id === reportData.id ? updated : r)));
      } else {
        const resp = await addReport(reportData);
        const created = resp.data ?? resp;
        setReports([...reports, created]);
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
    } catch (error) {
      // Si el backend devuelve errores de validación, mostrarlos
      const validation = error.response?.data;
      if (validation) {
        // ajusta esto según la forma de los errores (objeto o array)
        alert('Errores de validación:\n' + JSON.stringify(validation, null, 2));
        console.error('Validation details:', validation);
      } else {
        console.error('Error al guardar reporte:', error.message ?? error);
        alert('Error al guardar reporte. Revisa la consola.');
      }
    }
  };

  const handleEdit = (report) => {
    setReportData(report);
  };

  const handleDelete = async (id) => {
    try {
      await deleteReport(id);
      setReports(reports.filter(report => report.id !== id));
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
    }
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
        {loadingReports ? (
          <div>Cargando...</div>
        ) : (
          <ul>
            {reports.map((report) => (
              <li key={report.id}>
                {report.titulo}
                <Button onClick={() => handleEdit(report)}>Editar</Button>
                <Button onClick={() => handleDelete(report.id)}>Eliminar</Button>
              </li>
            ))}
          </ul>
        )}
      </Box>
    </Box>
  );
}

export default ReportForm;
