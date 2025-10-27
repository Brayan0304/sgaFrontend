import React, { useState } from 'react';
import SalaryTable from './SalaryTable';
import AddSalaryForm from './AddSalaryForm';

const SalaryManagement = () => {
    const [refresh, setRefresh] = useState(false);

    const handleSalaryAdded = () => setRefresh(prev => !prev);

    return (
        <div>
            <h2>Gestión de Salarios</h2>
            <AddSalaryForm onSalaryAdded={handleSalaryAdded} />
            <SalaryTable refresh={refresh} />
        </div>
    );
};

export default SalaryManagement;
