import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { addSalary, fetchUsers } from './api';

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
                setStaffList(data);
            } catch (error) {
                console.error("Error al cargar los empleados:", error);
            }
        };

        loadStaff();
    }, []);

    const handleAddSalary = async () => {
        if (!idEmpleado || !salario || !tiempoPago) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            await addSalary({ id_empleado: idEmpleado, salario, tiempo_pago: tiempoPago });
            onSalaryAdded();  // Refresca la lista de salarios después de agregar
            setIdEmpleado('');
            setSalario('');
            setTiempoPago('');
            setError('');
        } catch (error) {
            console.error("Error al agregar el salario:", error);
            setError("Hubo un error al agregar el salario.");
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
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField  
                label="Tiempo de Pago"
                value={tiempoPago}
                onChange={(e) => setTiempoPago(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button variant="contained" color="primary" onClick={handleAddSalary}>
                Agregar Salario
            </Button>
        </div>
    );
};

export default AddSalaryForm;
