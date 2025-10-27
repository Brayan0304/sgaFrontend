import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
    const payload = { ...reportData };
    delete payload.id;

    // Serializar objetos de estilo antes de enviar
    ['estilo_letra_titulo', 'estilo_letra_titulo_2', 'estilo_parrafo', 'estilo_expedicion'].forEach((k) => {
      if (payload[k] && typeof payload[k] === 'object') payload[k] = JSON.stringify(payload[k]);
    });

    const resp = await api.post('reports', payload);
    return resp.data ?? resp;
  } catch (error) {
    console.error('addReport error:', error.response?.data ?? error.message);
    throw error;
  }
};

const updateReport = async (id, reportData) => {
  try {
    const payload = { ...reportData };
    delete payload.id;

    ['estilo_letra_titulo', 'estilo_letra_titulo_2', 'estilo_parrafo', 'estilo_expedicion'].forEach((k) => {
      if (payload[k] && typeof payload[k] === 'object') payload[k] = JSON.stringify(payload[k]);
    });

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
  const theme = useTheme();
  const [reportData, setReportData] = useState({
    id: null,
    titulo: '',
    titulo_2: '',
    parrafo: '',
    expedicion: '',
    tamano_letra_titulo: '18',
    tamano_letra_titulo_2: '16',
    tamano_letra_parrafo: '12',
    tamano_letra_expedicion: '12',
    margen_izquierdo: '',
    margen_derecho: '',
    margen_superior: '',
    margen_inferior: '',
    tamano_hoja: 'carta',
    estilo_letra_titulo: { alignment: 'left', bold: false, italic: false, underline: false },
    estilo_letra_titulo_2: { alignment: 'left', bold: false, italic: false, underline: false },
    estilo_parrafo: { alignment: 'left', bold: false, italic: false, underline: false },
    estilo_expedicion: { alignment: 'left', bold: false, italic: false, underline: false },
  });

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [errors, setErrors] = useState({});

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
    setReportData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleStyleChange = (styleKey, field, value) => {
    setReportData((prev) => ({
      ...prev,
      [styleKey]: { ...(prev[styleKey] || {}), [field]: value },
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!reportData.titulo || !reportData.titulo.trim()) newErrors.titulo = 'Título es obligatorio';
    if (!reportData.parrafo || !reportData.parrafo.trim()) newErrors.parrafo = 'Párrafo es obligatorio';
    if (!reportData.tamano_letra_titulo) newErrors.tamano_letra_titulo = 'Tamaño letra título obligatorio';
    if (!reportData.tamano_letra_parrafo) newErrors.tamano_letra_parrafo = 'Tamaño letra párrafo obligatorio';
    ['margen_izquierdo', 'margen_derecho', 'margen_superior', 'margen_inferior'].forEach((m) => {
      if (reportData[m] === '' || reportData[m] === null) newErrors[m] = 'Este margen es obligatorio';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (reportData.id) {
        const resp = await updateReport(reportData.id, reportData);
        const updated = resp.data ?? resp;
        setReports(reports.map((r) => (r.id === reportData.id ? updated : r)));
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
        tamano_letra_titulo: '18',
        tamano_letra_titulo_2: '16',
        tamano_letra_parrafo: '12',
        tamano_letra_expedicion: '12',
        margen_izquierdo: '',
        margen_derecho: '',
        margen_superior: '',
        margen_inferior: '',
        tamano_hoja: 'carta',
        estilo_letra_titulo: { alignment: 'left', bold: false, italic: false, underline: false },
        estilo_letra_titulo_2: { alignment: 'left', bold: false, italic: false, underline: false },
        estilo_parrafo: { alignment: 'left', bold: false, italic: false, underline: false },
        estilo_expedicion: { alignment: 'left', bold: false, italic: false, underline: false },
      });
      setErrors({});
    } catch (error) {
      const validation = error.response?.data;
      if (validation) {
        alert('Errores de validación:\n' + JSON.stringify(validation, null, 2));
        console.error('Validation details:', validation);
      } else {
        console.error('Error al guardar reporte:', error.message ?? error);
        alert('Error al guardar reporte. Revisa la consola.');
      }
    }
  };

  const handleEdit = (report) => {
    const parsed = { ...report };
    ['estilo_letra_titulo', 'estilo_letra_titulo_2', 'estilo_parrafo', 'estilo_expedicion'].forEach((k) => {
      try {
        parsed[k] = typeof report[k] === 'string' ? JSON.parse(report[k]) : report[k] ?? { alignment: 'left', bold: false, italic: false, underline: false };
      } catch {
        parsed[k] = report[k] ?? { alignment: 'left', bold: false, italic: false, underline: false };
      }
    });
    setReportData({
      ...parsed,
      tamano_letra_titulo: parsed.tamano_letra_titulo ?? reportData.tamano_letra_titulo,
      tamano_letra_titulo_2: parsed.tamano_letra_titulo_2 ?? reportData.tamano_letra_titulo_2,
      tamano_letra_parrafo: parsed.tamano_letra_parrafo ?? reportData.tamano_letra_parrafo,
      tamano_letra_expedicion: parsed.tamano_letra_expedicion ?? reportData.tamano_letra_expedicion,
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await deleteReport(id);
      setReports(reports.filter((report) => report.id !== id));
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
    }
  };

  const previewStyle = (styleKey, sizeField) => {
    const s = reportData[styleKey] || {};
    const size = parseInt(reportData[sizeField], 10) || 12;
    return {
      fontWeight: s.bold ? 700 : 400,
      fontStyle: s.italic ? 'italic' : 'normal',
      textDecoration: s.underline ? 'underline' : 'none',
      textAlign: s.alignment || 'left',
      fontSize: `${size}px`,
      color: theme.palette.text.primary,
      lineHeight: 1.2,
    };
  };

  // small helper to render a row with field + size + style (sin previsualización)
  const FieldRow = ({ label, name, sizeName, styleKey, multiline }) => (
    <Grid item xs={12}>
      <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: theme.palette.background.paper, width: '100%' }}>
        {/* Fila superior: campo principal + tamaño */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>{label}</Typography>
            <TextField
              name={name}
              value={reportData[name]}
              onChange={handleChange}
              fullWidth
              multiline={!!multiline}
              rows={multiline ? 4 : 1}
              placeholder={label}
              error={!!errors[name]}
              helperText={errors[name]}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              inputProps={{ style: { color: theme.palette.text.primary } }}
              sx={{
                '& .MuiInputBase-input': { fontSize: 14 },
                bgcolor: theme.palette.action.hover,
                '& .MuiInputBase-input::placeholder': { color: theme.palette.text.disabled },
              }}
            />
          </Box>

          <Box sx={{ width: 110, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>Tamaño</Typography>
            <TextField
              name={sizeName}
              value={reportData[sizeName]}
              onChange={handleChange}
              size="small"
              type="number"
              inputProps={{ min: 6, max: 72, style: { color: theme.palette.text.primary } }}
            />
          </Box>
        </Box>

        {/* Fila de estilo: alineación + formatos en la misma línea, debajo del campo */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
          <FormControl component="fieldset" sx={{ flex: 1, minWidth: 240 }}>
            <RadioGroup
              row
              name={`${styleKey}_alignment`}
              value={reportData[styleKey]?.alignment || 'left'}
              onChange={(e) => handleStyleChange(styleKey, 'alignment', e.target.value)}
            >
              <FormControlLabel sx={{ color: theme.palette.text.primary }} value="left" control={<Radio size="small" />} label="Izq" />
              <FormControlLabel sx={{ color: theme.palette.text.primary }} value="center" control={<Radio size="small" />} label="Centrar" />
              <FormControlLabel sx={{ color: theme.palette.text.primary }} value="right" control={<Radio size="small" />} label="Der" />
              <FormControlLabel sx={{ color: theme.palette.text.primary }} value="justify" control={<Radio size="small" />} label="Justificar" />
            </RadioGroup>
          </FormControl>

          <FormGroup row sx={{ gap: 2 }}>
            <FormControlLabel
              sx={{ color: theme.palette.text.primary }}
              control={<Checkbox size="small" checked={!!reportData[styleKey]?.bold} onChange={(e) => handleStyleChange(styleKey, 'bold', e.target.checked)} />}
              label="Negrilla"
            />
            <FormControlLabel
              sx={{ color: theme.palette.text.primary }}
              control={<Checkbox size="small" checked={!!reportData[styleKey]?.italic} onChange={(e) => handleStyleChange(styleKey, 'italic', e.target.checked)} />}
              label="Cursiva"
            />
            <FormControlLabel
              sx={{ color: theme.palette.text.primary }}
              control={<Checkbox size="small" checked={!!reportData[styleKey]?.underline} onChange={(e) => handleStyleChange(styleKey, 'underline', e.target.checked)} />}
              label="Subrayada"
            />
          </FormGroup>
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>Configuración de Reportes</Typography>

      <Paper sx={{ p: 3, mb: 4, background: theme.palette.background.paper }} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <FieldRow label="Título" name="titulo" sizeName="tamano_letra_titulo" styleKey="estilo_letra_titulo" />
            <FieldRow label="Título 2" name="titulo_2" sizeName="tamano_letra_titulo_2" styleKey="estilo_letra_titulo_2" />
            <FieldRow label="Párrafo" name="parrafo" sizeName="tamano_letra_parrafo" styleKey="estilo_parrafo" multiline />
            <FieldRow label="Expedición" name="expedicion" sizeName="tamano_letra_expedicion" styleKey="estilo_expedicion" />

            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, bgcolor: '#fff' }} elevation={1}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Márgenes</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <TextField label="Margen izquierdo" name="margen_izquierdo" value={reportData.margen_izquierdo} onChange={handleChange} fullWidth required error={!!errors.margen_izquierdo} helperText={errors.margen_izquierdo} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField label="Margen derecho" name="margen_derecho" value={reportData.margen_derecho} onChange={handleChange} fullWidth required error={!!errors.margen_derecho} helperText={errors.margen_derecho} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField label="Margen superior" name="margen_superior" value={reportData.margen_superior} onChange={handleChange} fullWidth required error={!!errors.margen_superior} helperText={errors.margen_superior} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField label="Margen inferior" name="margen_inferior" value={reportData.margen_inferior} onChange={handleChange} fullWidth required error={!!errors.margen_inferior} helperText={errors.margen_inferior} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: '#fff' }} elevation={1}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Hoja y opciones</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="tamano-hoja-label">Tamaño hoja</InputLabel>
                  <Select labelId="tamano-hoja-label" label="Tamaño hoja" name="tamano_hoja" value={reportData.tamano_hoja} onChange={handleChange}>
                    <MenuItem value="carta">Carta</MenuItem>
                    <MenuItem value="A4">A4</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ textTransform: 'none', fontWeight: 600 }}>
                  {reportData.id ? 'Actualizar Reporte' : 'Crear Reporte'}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Box mt={2}>
        <Typography variant="h5" sx={{ mb: 1 }}>Listado de Reportes</Typography>
        {loadingReports ? (
          <div>Cargando...</div>
        ) : (
          <Box>
            {reports.map((report) => (
              <Paper key={report.id} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{report.titulo}</Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>{report.parrafo?.slice(0, 120)}</Typography>
                </Box>
                <Box>
                  <Button size="small" onClick={() => handleEdit(report)} sx={{ mr: 1 }}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(report.id)}>Eliminar</Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ReportForm;
