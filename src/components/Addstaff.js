import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// User API functions
const fetchUsers = async () => {
    try {
        const response = await api.get('addstaff');
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

const addUser = async (userData) => {
    try {
        // Pasar el token CSRF como un string simple
        const response = await api.post('addstaff', userData);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

const updateUser = async (id, userData) => {
    try {
        // Pasar el token CSRF como un string simple
        const response = await api.put(`addstaff/actualizar/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        await api.delete(`addstaff/${id}`);
    } catch (error) {
        console.error(error.message);
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

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await fetchUsers();
            setUsers(data || []);
        } catch (error) {
            console.error("Error loading users:", error);
            setSnackbarMessage('Error al cargar usuarios');
            setSnackbarOpen(true);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleClickOpen = (user) => {
        setCurrentUser(user ? { ...user } : {
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
            fecha_ingreso: '', // nuevo
            fecha_salida: ''   // nuevo
        });
        setIsEditing(!!user);
        setOpen(true);
    };

    const handleClose = () => {
        setCurrentUser(null);
        setOpen(false);
        setIsEditing(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (isEditing) {
                await updateUser(currentUser.id, currentUser);
                setSnackbarMessage('Usuario actualizado exitosamente');
            } else {
                await addUser(currentUser);
                setSnackbarMessage('Usuario creado exitosamente');
            }
            handleClose();
            loadUsers();
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            setSnackbarMessage('Error al guardar el usuario');
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            loadUsers();
            setSnackbarMessage('Usuario eliminado exitosamente');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            setSnackbarMessage('Error al eliminar el usuario');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Button variant="contained" color="success" onClick={() => handleClickOpen(null)}>
                        Agregar Usuario
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Nombres y Apellidos</TableCell>
                                    <TableCell align="center">Cédula</TableCell>
                                    <TableCell align="center">Dirección</TableCell>
                                    <TableCell align="center">Correo</TableCell>
                                    <TableCell align="center">Teléfono</TableCell>
                                    <TableCell align="center">Cargo</TableCell>
                                    <TableCell align="center">Fecha de Nacimiento</TableCell>
                                    <TableCell align="center">Municipio de Expedición</TableCell>
                                    <TableCell align="center">Departamento de Expedición</TableCell>
                                    <TableCell align="center">Fecha Ingreso</TableCell>
                                    <TableCell align="center">Fecha Salida</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loadingUsers ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : users.length > 0 ? (
                                    users.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">{row.name} {row.apellidos}</TableCell>
                                            <TableCell align="center">{row.id}</TableCell>
                                            <TableCell align="center">{row.direccion}</TableCell>
                                            <TableCell align="center">{row.email}</TableCell>
                                            <TableCell align="center">{row.telefono}</TableCell>
                                            <TableCell align="center">{row.cargo}</TableCell>
                                            <TableCell align="center">{row.fecha_nacimiento}</TableCell>
                                            <TableCell align="center">{row.municipio_expedicion}</TableCell>
                                            <TableCell align="center">{row.departamento_expedicion}</TableCell>
                                            <TableCell align="center">{row.fecha_ingreso || '—'}</TableCell>
                                            <TableCell align="center">{row.fecha_salida || '—'}</TableCell>

                                            <TableCell align="center">
                                                <Button onClick={() => handleClickOpen(row)}>Editar</Button>
                                                <Button onClick={() => handleDelete(row.id)}>Eliminar</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">No hay usuarios disponibles</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cédula"
                        type="text"
                        fullWidth
                        value={currentUser ? currentUser.id : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, id: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Nombres"
                        type="text"
                        fullWidth
                        value={currentUser ? currentUser.name : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Apellidos"
                        type="text"
                        fullWidth
                        value={currentUser ? currentUser.apellidos : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, apellidos: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Dirección"
                        type="text"
                        fullWidth
                        value={currentUser ? currentUser.direccion : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, direccion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Correo"
                        type="email"
                        fullWidth
                        value={currentUser ? currentUser.email : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Teléfono"
                        type="text"
                        fullWidth
                        value={currentUser ? currentUser.telefono : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, telefono: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Cargo"
                        type="text"
                        fullWidth
                        value={currentUser ? currentUser.cargo : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, cargo: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha de Nacimiento"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentUser ? currentUser.fecha_nacimiento : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, fecha_nacimiento: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Municipio de Expedición"
                        type="text"
                        fullWidth
                        value={currentUser ? currentUser.municipio_expedicion : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, municipio_expedicion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Departamento de Expedición"
                        type="text"
                        fullWidth
                        value={currentUser ? currentUser.departamento_expedicion : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, departamento_expedicion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha de Ingreso"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentUser ? currentUser.fecha_ingreso : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, fecha_ingreso: e.target.value })}
                    />

                    <TextField
                        margin="dense"
                        label="Fecha de Salida"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentUser ? currentUser.fecha_salida : ''}
                        onChange={(e) => setCurrentUser({ ...currentUser, fecha_salida: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default AutoGrid;
