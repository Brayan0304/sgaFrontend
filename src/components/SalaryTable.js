import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetchSalaries, deleteSalary, updateSalary } from './api';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const payOptions = [
    'Diario',
    'Quincenal',
    'Mensual',
    'Trimestral',
    'Semestral',
    'Anual',
];

const SalaryTable = ({ refresh }) => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadSalaries();
        // recarga cuando cambia "refresh"
        // Nota: el array de dependencias es literal y estable
    }, [refresh]);

    const loadSalaries = async () => {
        setLoading(true);
        try {
            const data = await fetchSalaries();
            setSalaries(data);
        } catch (error) {
            console.error("Error al cargar los salarios:", error);
            setSnackbar({ open: true, message: 'Error al cargar salarios', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteSalary(id);
            setSnackbar({ open: true, message: 'Salario eliminado', severity: 'success' });
            loadSalaries();
        } catch (e) {
            console.error(e);
            setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
        }
    };

    // Usa updateSalary desde api.js (maneja rutas)
    const handleTiempoChange = async (id, value) => {
        // optimista en UI
        setSalaries(prev => prev.map(s => (s.id === id ? { ...s, tiempo_pago: value } : s)));
        setSavingId(id);
        try {
            await updateSalary(id, { tiempo_pago: value });
            setSnackbar({ open: true, message: 'Tiempo de pago actualizado', severity: 'success' });
            loadSalaries();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'No se pudo actualizar tiempo de pago', severity: 'error' });
            loadSalaries(); // revertir o resync
        } finally {
            setSavingId(null);
        }
    };

    return (
        <TableContainer component={Paper} sx={{ p: 1 }}>
            <Table aria-label="salary table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Apellido</TableCell>
                        <TableCell align="center">Cargo</TableCell>
                        <TableCell align="center">Salario</TableCell>
                        <TableCell align="center">Tiempo de Pago</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <Box sx={{ py: 2 }}><CircularProgress size={28} /></Box>
                            </TableCell>
                        </TableRow>
                    ) : salaries.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">No hay salarios cargados.</TableCell>
                        </TableRow>
                    ) : (
                        salaries.map((salary) => (
                            <TableRow key={salary.id}>
                                <TableCell>{salary.name}</TableCell>
                                <TableCell>{salary.apellidos}</TableCell>
                                <TableCell>{salary.cargo}</TableCell>
                                <TableCell align="center">{salary.salario}</TableCell>
                                <TableCell align="center">
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={salary.tiempo_pago || ''}
                                            onChange={(e) => handleTiempoChange(salary.id, e.target.value)}
                                            disabled={savingId === salary.id}
                                            displayEmpty
                                        >
                                            <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                            {payOptions.map(opt => (
                                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="error" onClick={() => handleDelete(salary.id)} aria-label="Eliminar">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3500}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </TableContainer>
    );
};

export default SalaryTable;
