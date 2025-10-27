import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// API functions
const fetchUsers = async () => {
    try {
        const response = await api.get('addstaff');
        return response.data;
    } catch (error) {
        console.error(error.response?.data ?? error.message);
        throw error;
    }
};

const addUser = async (userData) => {
    try {
        // enviar el id: el backend requiere 'id' (cédula)
        const payload = { ...userData };
        const response = await api.post('addstaff', payload);
        return response.data;
    } catch (error) {
        console.error(error.response?.data ?? error.message);
        throw error;
    }
};

const updateUser = async (id, userData) => {
    try {
        const payload = { ...userData };
        delete payload.id;
        const response = await api.put(`addstaff/actualizar/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error(error.response?.data ?? error.message);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        await api.delete(`addstaff/${id}`);
    } catch (error) {
        console.error(error.response?.data ?? error.message);
        throw error;
    }
};

const AutoGrid = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // validation state (no photo)
    const [errors, setErrors] = useState({});

    // UI states
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // helper to guarantee controlled inputs
    const cv = (field) =>
        currentUser && currentUser[field] !== undefined && currentUser[field] !== null
            ? currentUser[field]
            : '';

    useEffect(() => {
        loadUsers();
    }, []);

    // normalize date strings to YYYY-MM-DD so <input type="date"> shows them
    const normalizeDates = (u) => {
        const sliceDate = (d) => {
            if (!d) return '';
            // if already "YYYY-MM-DD" return as is
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
            // if ISO datetime: take first 10 chars
            if (typeof d === 'string' && d.length >= 10) return d.slice(0, 10);
            return '';
        };
        return {
            ...u,
            fecha_ingreso: sliceDate(u?.fecha_ingreso),
            fecha_nacimiento: sliceDate(u?.fecha_nacimiento),
            fecha_salida: sliceDate(u?.fecha_salida),
        };
    };

    // formato para mostrar en tabla: DD/MM/YYYY
    const formatDate = (d) => {
        if (!d) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
            const [y, m, day] = d.split('-');
            return `${day}/${m}/${y}`;
        }
        return d;
    };

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await fetchUsers();
            const list = Array.isArray(data) ? data : data.data ?? [];
            const normalized = list.map(normalizeDates);
            setUsers(normalized);
        } catch (error) {
            console.error("Error loading users:", error);
            setSnackbarMessage('Error al cargar usuarios');
            setSnackbarOpen(true);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleClickOpen = (user) => {
        setCurrentUser(
            user
                ? { ...normalizeDates(user) }
                : {
                      id: '',
                      name: '',
                      apellidos: '',
                      direccion: '',
                      email: '',
                      telefono: '',
                      cargo: '',
                      fecha_nacimiento: '',
                      municipio_expedicion: '',
                      departamento_expedicion: '',
                      fecha_ingreso: '',
                      fecha_salida: '',
                  }
        );
        setIsEditing(!!user);
        setErrors({});
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentUser(null);
        setOpen(false);
        setIsEditing(false);
        setErrors({});
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    // validateUser ahora devuelve { errors, missingFields } y mensajes en español
    const validateUser = (u) => {
        const e = {};
        const missing = [];

        const addMissing = (key, label) => {
            e[key] = 'Este campo es obligatorio';
            missing.push(label);
        };

        if (!u || !String(u.id || '').trim()) addMissing('id', 'Cédula');
        if (!u || !String(u.name || '').trim()) addMissing('name', 'Nombres');
        if (!u || !String(u.apellidos || '').trim()) addMissing('apellidos', 'Apellidos');
        if (!u || !String(u.email || '').trim()) addMissing('email', 'Correo');
        if (!u || !String(u.fecha_nacimiento || '').trim()) addMissing('fecha_nacimiento', 'Fecha de Nacimiento');
        if (!u || !String(u.municipio_expedicion || '').trim()) addMissing('municipio_expedicion', 'Municipio de Expedición');
        if (!u || !String(u.departamento_expedicion || '').trim()) addMissing('departamento_expedicion', 'Departamento de Expedición');
        if (!u || !String(u.direccion || '').trim()) addMissing('direccion', 'Dirección');
        if (!u || !String(u.telefono || '').trim()) addMissing('telefono', 'Teléfono');
        if (!u || !String(u.cargo || '').trim()) addMissing('cargo', 'Cargo');
        if (!u || !String(u.fecha_ingreso || '').trim()) addMissing('fecha_ingreso', 'Fecha de Ingreso');
        // fecha_salida es opcional: no la añadimos a missing

        // validaciones específicas (si están presentes)
        if (u && u.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email)) e.email = 'Correo inválido';
        if (u && u.telefono && u.telefono.length && !/^\+?\d{7,15}$/.test(String(u.telefono)))
            e.telefono = 'Teléfono inválido';

        return { errors: e, missingFields: missing };
    };

    const handleSave = async () => {
        const { errors: validationErrors, missingFields } = validateUser(currentUser);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            if (missingFields.length) {
                setSnackbarMessage('Faltan campos obligatorios: ' + missingFields.join(', '));
            } else {
                setSnackbarMessage('Corrige los campos en rojo');
            }
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            // preparar payload: convertir fecha_salida vacía a null (Laravel acepta nullable)
            const payload = { ...currentUser };
            if (payload.fecha_salida === '') payload.fecha_salida = null;

            if (isEditing) {
                await updateUser(currentUser.id, payload);
                setSnackbarMessage('Usuario actualizado exitosamente');
            } else {
                await addUser(payload);
                setSnackbarMessage('Usuario creado exitosamente');
            }

            handleClose();
            await loadUsers();
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            const msg = error.response?.data?.message ?? error.response?.data ?? error.message ?? 'Error al guardar el usuario';
            setSnackbarMessage(msg);
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar usuario?')) return;
        try {
            await deleteUser(id);
            await loadUsers();
            setSnackbarMessage('Usuario eliminado exitosamente');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            setSnackbarMessage('Error al eliminar el usuario');
            setSnackbarOpen(true);
        }
    };

    // Filtrado y paginación
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                `${u.name || ''} ${u.apellidos || ''}`.toLowerCase().includes(q) ||
                (u.id && String(u.id).includes(q)) ||
                (u.email && u.email.toLowerCase().includes(q)) ||
                (u.cargo && u.cargo.toLowerCase().includes(q))
        );
    }, [users, query]);

    const paginated = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const exportCSV = () => {
        if (!users.length) return;
        const header = [
            'id',
            'name',
            'apellidos',
            'email',
            'telefono',
            'cargo',
            'fecha_nacimiento',
            'municipio_expedicion',
            'departamento_expedicion',
            'fecha_ingreso',
            'fecha_salida',
        ];
        const rows = users.map((u) => header.map((h) => `"${(u[h] ?? '').toString().replace(/"/g, '""')}"`).join(','));
        const csv = [header.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `usuarios_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <Box sx={{ p: 2 }}>
            <Paper elevation={6} sx={{ p: 2, mb: 2, borderRadius: 2, background: 'linear-gradient(90deg,#ffffff,#f7fbff)' }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0b63c6' }}>
                            Gestión de Usuarios
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Administra el personal — agrega, edita o exporta
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} container justifyContent="flex-end" spacing={1}>
                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                size="small"
                                placeholder="Buscar por nombre, cédula, correo o cargo"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setPage(0);
                                }}
                                sx={{ mr: 1, width: 320 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Tooltip title="Exportar CSV">
                                <IconButton color="primary" onClick={exportCSV} sx={{ mr: 1 }}>
                                    <GetAppIcon />
                                </IconButton>
                            </Tooltip>
                            <Button variant="contained" startIcon={<AddIcon />} color="success" onClick={() => handleClickOpen(null)} sx={{ boxShadow: 3 }}>
                                Agregar Usuario
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ borderRadius: 2 }}>
                <TableContainer sx={{ maxHeight: 480 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ background: 'linear-gradient(90deg,#f5f7fa,#e8eef8)' }}>
                                <TableCell>Usuario</TableCell>
                                <TableCell align="center">Cédula</TableCell>
                                <TableCell align="center">Correo</TableCell>
                                <TableCell align="center">Teléfono</TableCell>
                                <TableCell align="center">Cargo</TableCell>
                                <TableCell align="center">Fecha Nac.</TableCell>
                                <TableCell align="center">Fecha Ingreso</TableCell>
                                <TableCell align="center">Fecha Salida</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingUsers ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : paginated.length > 0 ? (
                                paginated.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: (theme) => theme.palette.action.hover },
                                        }}
                                    >
                                        <TableCell>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item>
                                                    <Avatar sx={{ bgcolor: '#1976d2', width: 44, height: 44, border: '2px solid #e8eef8' }}>
                                                        {row.name ? row.name[0].toUpperCase() : '?'}
                                                    </Avatar>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {row.name} {row.apellidos}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {row.direccion}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center">{row.telefono}</TableCell>
                                        <TableCell align="center">{row.cargo}</TableCell>
                                        <TableCell align="center">{formatDate(row.fecha_nacimiento)}</TableCell>
                                        <TableCell align="center">{formatDate(row.fecha_ingreso)}</TableCell>
                                        <TableCell align="center">{formatDate(row.fecha_salida)}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton size="small" onClick={() => handleClickOpen(row)}>
                                                    <EditIcon color="info" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton size="small" onClick={() => handleDelete(row.id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        No hay usuarios disponibles
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination component="div" count={filtered.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25]} />
            </Paper>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ bgcolor: '#f7fbff' }}>{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={3} container direction="column" alignItems="center" justifyContent="center" spacing={1}>
                            <Grid item>
                                <Avatar sx={{ width: 90, height: 90, bgcolor: '#1976d2', boxShadow: 2 }}>{cv('name') ? cv('name')[0].toUpperCase() : '?'}</Avatar>
                            </Grid>
                            <Grid item>
                                <Typography variant="caption" color="text.secondary">
                                    Avatar (no guardado, sólo iniciales)
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={9}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Cédula *" required fullWidth value={cv('id')} onChange={(e) => setCurrentUser({ ...currentUser, id: e.target.value })} error={!!errors.id} helperText={errors.id} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Nombres *" required fullWidth value={cv('name')} onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} error={!!errors.name} helperText={errors.name} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Apellidos *" required fullWidth value={cv('apellidos')} onChange={(e) => setCurrentUser({ ...currentUser, apellidos: e.target.value })} error={!!errors.apellidos} helperText={errors.apellidos} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Correo *" type="email" required fullWidth value={cv('email')} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} error={!!errors.email} helperText={errors.email} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Teléfono *" required fullWidth type="tel" placeholder="+573001234567" value={cv('telefono')} onChange={(e) => setCurrentUser({ ...currentUser, telefono: e.target.value })} error={!!errors.telefono} helperText={errors.telefono} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Cargo *" required fullWidth value={cv('cargo')} onChange={(e) => setCurrentUser({ ...currentUser, cargo: e.target.value })} error={!!errors.cargo} helperText={errors.cargo} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Fecha de Nacimiento *" required type="date" fullWidth InputLabelProps={{ shrink: true }} value={cv('fecha_nacimiento')} onChange={(e) => setCurrentUser({ ...currentUser, fecha_nacimiento: e.target.value })} error={!!errors.fecha_nacimiento} helperText={errors.fecha_nacimiento} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Fecha de Ingreso *" required type="date" fullWidth InputLabelProps={{ shrink: true }} value={cv('fecha_ingreso')} onChange={(e) => setCurrentUser({ ...currentUser, fecha_ingreso: e.target.value })} error={!!errors.fecha_ingreso} helperText={errors.fecha_ingreso} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Fecha de Salida" type="date" fullWidth InputLabelProps={{ shrink: true }} value={cv('fecha_salida')} onChange={(e) => setCurrentUser({ ...currentUser, fecha_salida: e.target.value })} error={!!errors.fecha_salida} helperText={errors.fecha_salida || 'Opcional'} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Dirección *" required fullWidth value={cv('direccion')} onChange={(e) => setCurrentUser({ ...currentUser, direccion: e.target.value })} error={!!errors.direccion} helperText={errors.direccion} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Municipio de Expedición *" required fullWidth value={cv('municipio_expedicion')} onChange={(e) => setCurrentUser({ ...currentUser, municipio_expedicion: e.target.value })} error={!!errors.municipio_expedicion} helperText={errors.municipio_expedicion} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Departamento de Expedición *" required fullWidth value={cv('departamento_expedicion')} onChange={(e) => setCurrentUser({ ...currentUser, departamento_expedicion: e.target.value })} error={!!errors.departamento_expedicion} helperText={errors.departamento_expedicion} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose}>CANCELAR</Button>
                    <Button onClick={handleSave} disabled={loading} variant="contained" color="primary" startIcon={<SaveIcon />}>
                        {loading ? <CircularProgress size={20} /> : isEditing ? 'ACTUALIZAR' : 'GUARDAR'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
        </Box>
    );
};

export default AutoGrid;