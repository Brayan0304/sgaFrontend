import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { addSalary, fetchUsers } from './api';

const payOptions = [
    'Diario',
    'Quincenal',
    'Mensual',
    'Trimestral',
    'Semestral',
    'Anual',
];

const AddSalaryForm = ({ onSalaryAdded }) => {
    const [idEmpleado, setIdEmpleado] = useState('');
    const [salario, setSalario] = useState('');
    const [tiempoPago, setTiempoPago] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Obtener la lista de empleados cuando el componente se monte
        const loadStaff = async () => {
            try {
                const data = await fetchUsers();
                setStaffList(data || []);
            } catch (error) {
                console.error("Error al cargar los empleados:", error);
            }
        };

        loadStaff();
    }, []);

    const handleAddSalary = async () => {
        if (!idEmpleado || salario === '' || !tiempoPago) {
            setError("Todos los campos son obligatorios");
            return;
        }

        const payload = {
            id_empleado: idEmpleado, // enviar como string (no Number)
            salario: Number(salario),
            tiempo_pago: tiempoPago
        };

        try {
            await addSalary(payload);
            onSalaryAdded();  // Refresca la lista de salarios después de agregar
            setIdEmpleado('');
            setSalario('');
            setTiempoPago('');
            setError('');
        } catch (err) {
            console.error("Error al agregar el salario:", err.response?.data || err);
            const resp = err.response?.data;
            if (resp) {
                const serverMessage = resp.message || (resp.errors ? Object.values(resp.errors).flat().join(', ') : JSON.stringify(resp));
                setError(serverMessage);
            } else {
                setError("Hubo un error al agregar el salario.");
            }
        }
    };

    return (
        <div>
            <h3>Agregar Salario</h3>
            <TextField
                select
                label="Empleado"
                value={idEmpleado}
                onChange={(e) => setIdEmpleado(e.target.value)}
                fullWidth
                margin="normal"
                required
            >
                {staffList.map((staff) => (
                    <MenuItem key={staff.id} value={staff.id}>
                        {staff.name} {staff.apellidos} - {staff.cargo}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Salario"
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                select
                label="Tiempo de Pago"
                value={tiempoPago}
                onChange={(e) => setTiempoPago(e.target.value)}
                fullWidth
                margin="normal"
                required
            >
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                {payOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
            </TextField>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button variant="contained" color="primary" onClick={handleAddSalary}>
                Agregar Salario
            </Button>
        </div>
    );
};

export default AddSalaryForm;
