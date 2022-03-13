import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { deleteEmployee, readEmployee, updateEmployee } from "../utils/api";

const EditEmployee = () => {
    const user = localStorage.getItem("user")
    const params = useParams();
    const history = useHistory();

    const initialFormState = {
        employee_name: "",
        employee_email: "",
        admin: false,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errorMessage, setErrorMessage] = useState(null);
    const [disabled, setDisabled] = useState(null);

    const handleChange = ({target}) => {
        setFormData({
            ...formData, 
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const invalidFields = [];
        console.log(formData)
        if (!formData.employee_email) invalidFields.push("Email");
        if (!formData.employee_name) invalidFields.push("Name");
        if (typeof formData.admin != "boolean") invalidFields.push("Admin")
        if (invalidFields.length) {
            setErrorMessage(invalidFields.join(", ") + "are invalid")
        } else {
            const data = {
                employee_email: formData.employee_email,
                employee_name: formData.employee_name,
                admin: formData.admin
            };
            await updateEmployee(data, params.employeeId);
            setFormData(initialFormState)
        }

    };

    const onDelete = async () => {
        const confirm = window.prompt("Are you sure? Please type 'delete' to confirm")
        if (confirm === 'delete') {
            deleteEmployee(params.employeeId)
            .then(response => {
                if (response.status===200) {
                    window.alert("User successfully deleted")
                    history.push("/employees")
                } else {
                    window.alert("Action failed")
                }
            })
        }
        
    }

    useEffect(() => {
        const loadEmployee = async () => {
            await readEmployee(params.employeeId)
                .then(response => {
                    if (user === response.employee_email) {
                        setDisabled("disabled")
                    };
                    setFormData({
                        ...formData,
                        employee_name: response.employee_name,
                        employee_email: response.employee_email,
                        admin: response.admin
                    })
                })
        }
        loadEmployee()
    }, [params.employeeId])

    return (
        <main>
            <h1>New Employee</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-3 labels">
                        <label htmlFor="employee_name">Name</label>
                        <label htmlFor="employee_email">Email</label>
                        <label htmlFor="admin">Admin?</label>
                    </div>
                    <div className="col-md-3 inputs">
                        <input type="text" id="employee_name" name="employee_name" onChange={handleChange} value={formData.employee_name} />
                        <input type="text" id="employee_email" name="employee_email" onChange={handleChange} value={formData.employee_email} />
                        <select name="admin" id="admin" onChange={handleChange}>
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>    
                        </select> <br/>
                        <button type="submit">Submit</button>
                    </div>
                </div>
                {errorMessage ? <p>{errorMessage}</p> : null}
            </form>
            <button onClick={onDelete} className="btn btn-danger" disabled={disabled}>Delete</button>
        </main>
    )
}

export default EditEmployee;