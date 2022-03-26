import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createEmployee } from "../utils/api";

const NewEmployee = () => {
    const history = useHistory()
    const initialFormState = {
        employee_name: "",
        employee_email: "",
        password: "",
        passwordMatch: "",
        admin: false,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [disabled, setDisabled] = useState("disabled");
    const [errorMessage, setErrorMessage] = useState(null)

    const handleChange = ({target}) => {
        setFormData({
            ...formData, 
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        const invalidFields = [];
        if (!formData.employee_email) invalidFields.push("Email");
        if (!formData.employee_name) invalidFields.push("Name");
        if (formData.password != formData.passwordMatch) invalidFields.push("Password");
        if (typeof formData.admin != "boolean") invalidFields.push("Admin")
        if (invalidFields.length) {
            setErrorMessage(invalidFields.join(", ") + "are invalid")
        } else {
            const data = {
                employee_email: formData.employee_email,
                employee_name: formData.employee_name,
                password: formData.password,
                admin: formData.admin
            };
            await createEmployee(data, abortController.signal);
            setFormData(initialFormState)
            history.push("/employees")
        }
    };

    useEffect(() => {
        if (formData.employee_name && formData.employee_email.split("@").length === 2 && formData.password === formData.passwordMatch && formData.password) {
            setDisabled(null)
        } else {
            setDisabled("disabled")
        }
    }, [formData.employee_email, formData.employee_name, formData.password, formData.passwordMatch])

    return (
        <main>
            <h1 className="subHeader">New Employee</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-3 labels">
                        <label htmlFor="employee_name">Name</label>
                        <label htmlFor="employee_email">Email</label>
                        <label htmlFor="password">Password</label>
                        <label htmlFor="passwordMatch">Re-type Password</label>
                        <label htmlFor="admin">Admin?</label>
                    </div>
                    <div className="col-md-3 inputs">
                        <input type="text" id="employee_name" name="employee_name" onChange={handleChange} value={formData.employee_name} />
                        <input type="text" id="employee_email" name="employee_email" onChange={handleChange} value={formData.employee_email} />
                        <input type="text" id="password" name="password" onChange={handleChange} value={formData.password} />
                        <input type="text" id="passwordMatch" name="passwordMatch" onChange={handleChange} value={formData.passwordMatch} />
                        {formData.password != formData.passwordMatch ? <p>Passwords Do not match</p>: null}
                        <select name="admin" id="admin" onChange={handleChange}>
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>    
                        </select> <br/>
                        <button type="submit" disabled={disabled}>Submit</button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default NewEmployee;