import React from "react";
import {Link} from 'react-router-dom'

const FormatEmployeesList = ({employees}) => {
    const employeesTable = [];
    employees.forEach(employee => {
        const path=`/employees/edit/${employee.employee_id}`
        employeesTable.push(
            <tr key={employee.employee_id}>
                <td>{employee.employee_email}</td>
                <td>{employee.employee_name}</td>
                <td>{employee.admin ? "Yes": "No"}</td>
                <td><button>Reset Password</button></td>
                <td><Link to={path}><button>Edit</button></Link></td>
            </tr>
        )
    })

    return (
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Admin?</th>
                </tr>
            </thead>
            <tbody>
                {employeesTable}
            </tbody>
        </table>
    )
}

export default FormatEmployeesList;