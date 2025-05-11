import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Cambia según tu configuración
});


// Funciones para manejar usuarios
export const fetchUsers = async () => {
    try {
        const response = await api.get('/addstaff');
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await api.post('/addstaff', userData);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/actualizar/addstaff/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        await api.delete(`/addstaff/${id}`);
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

// Funciones para manejar salarios
export const fetchSalaries = async () => {
    try {
        const response = await api.get('/addsalary');
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const addSalary = async (salaryData) => {
    try {
        const response = await api.post('/addsalary', salaryData);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const updateSalary = async (id, salaryData) => {
    try {
        const response = await api.put(`/addsalary/actualizar/${id}`, salaryData);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const deleteSalary = async (id) => {
    try {
        await api.delete(`/addsalary/${id}`);
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};
