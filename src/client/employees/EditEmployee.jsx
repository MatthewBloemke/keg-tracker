import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteEmployee, readEmployee, resetPassword, updateEmployee } from "../utils/api";

const EditEmployee = () => {
    const user = localStorage.getItem("user")
    const params = useParams();
    const history = useHistory();

    const initialFormState = {
        employee_id: null,
        employee_name: "",
        employee_email: "",
        password: "",
        passwordMatch: "",
        admin: false,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errorMessage, setErrorMessage] = useState(null);
    const [disabled, setDisabled] = useState(null);
    const [passwordDisabled, setPasswordDisabled] = useState("disabled")

    const handleChange = ({target}) => {
        setFormData({
            ...formData, 
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController()
        const invalidFields = [];
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
            await updateEmployee(data, params.employeeId, abortController.signal);
            setFormData(initialFormState)
        }

    };

    const submitPassword = async (event) => {
        event.preventDefault();
        //add error handler if passwords don't match
        const data = {
            employee_email: formData.employee_email,
            employee_name: formData.employee_name,
            admin: formData.admin,
            password: formData.password
        }
        await resetPassword(data, params.employeeId)
        setFormData(initialFormState)
    }

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
        const abortController = new AbortController();

        const loadEmployee = async () => {
            await readEmployee(params.employeeId, abortController.signal)
                .then(response => {
                    if (user === response.employee_email) {
                        setDisabled("disabled")
                    };
                    setFormData({
                        ...formData,
                        employee_name: response.employee_name,
                        employee_email: response.employee_email,
                        admin: response.admin,
                        employee_id: params.employeeId
                    })
                })
        }
        
        if (formData.employee_id != params.employeeId) {
           loadEmployee() 
        }
        if (formData.password === formData.passwordMatch) {
            setPasswordDisabled(null)
        } else {
            setPasswordDisabled("disabled")
        }

        return () => abortController.abort()
    }, [params.employeeId, formData.password, formData.passwordMatch])

    return (
        <main>
            <h1>Edit Employee</h1>
                <div className="row">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-3 labels">
                                    <label htmlFor="employee_name">Name</label><br/>
                                    <label htmlFor="employee_email">Email</label><br/>
                                    <label htmlFor="admin">Admin?</label>
                                </div>
                                <div className="col-md-3 inputs">
                                    <input type="text" id="employee_name" name="employee_name" onChange={handleChange} value={formData.employee_name} />
                                    <input type="text" id="employee_email" name="employee_email" onChange={handleChange} value={formData.employee_email} />
                                    <select name="admin" id="admin" onChange={handleChange}>
                                        <option value={false}>No</option>
                                        <option value={true}>Yes</option>    
                                    </select> <br/>
                                    <button className="btn btn-success" type="submit">Submit</button>
                                </div>
                            {errorMessage ? <p>{errorMessage}</p> : null}
                            </div>
                        </form>
                    </div>
                    <div className="col-md-6">
                        <form onSubmit={submitPassword}>
                            <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="password">Password</label><br/>
                                    <label htmlFor="passwordMatch">Retype Password</label>
                                </div>
                                <div className="col-md-3">
                                    <input type="text" id="password" name="password" onChange={handleChange} value={formData.password} /> <br/>
                                    <input type="text" id="passwordMatch" name="passwordMatch" onChange={handleChange} value={formData.passwordMatch} /> <br/>
                                    {passwordDisabled ? <p>Passwords do not match</p> : null}
                                    <button className="btn btn-success" type="submit" disabled={passwordDisabled}>Reset Password</button>
                                </div>                                
                            </div>

                        </form>
                    </div>
                </div>


                
            <button onClick={onDelete} className="btn btn-danger" disabled={disabled}>Delete</button>
        </main>
    )
}

export default EditEmployee;