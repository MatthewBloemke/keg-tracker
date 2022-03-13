import React, { useEffect, useState } from 'react'
import { getEmployees } from '../utils/api';
import FormatEmployeesList from './FormatEmployeesList'

const ListEmployees = () => {
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        getEmployees()
            .then(setEmployees)
    }, []);
    return <FormatEmployeesList employees={employees}/>
}

export default ListEmployees;