import React, { useEffect, useState } from 'react'
import { getEmployees} from '../utils/api';
import FormatEmployeesList from './FormatEmployeesList'

const ListEmployees = () => {
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();
        getEmployees(abortController.signal)
            .then(setEmployees)

        return () => abortController.abort();
    }, []);
    return <FormatEmployeesList employees={employees}/>
}

export default ListEmployees;