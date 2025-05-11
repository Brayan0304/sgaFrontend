import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetchSalaries, deleteSalary } from './api';

const SalaryTable = () => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSalaries();
    }, []);

    const loadSalaries = async () => {
        setLoading(true);
        try {
            const data = await fetchSalaries();
            setSalaries(data);
        } catch (error) {
            console.error("Error al cargar los salarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        await deleteSalary(id);
        loadSalaries();
    };

    return (
        <TableContainer component={Paper}>
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
                    {salaries.map((salary) => (
                        <TableRow key={salary.id}>
                            <TableCell>{salary.name}</TableCell>
                            <TableCell>{salary.apellidos}</TableCell>
                            <TableCell>{salary.cargo}</TableCell>
                            <TableCell align="center">{salary.salario}</TableCell>
                            <TableCell align="center">{salary.tiempo_pago}</TableCell>
                            <TableCell align="center">
                                <Button variant="contained" color="secondary" onClick={() => handleDelete(salary.id)}>
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SalaryTable;
