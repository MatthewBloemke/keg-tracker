import React, {useState} from 'react'

const CustomInput = (props) => {
    const {name, color, handleChange, label, type, value} = props;
    const [placeholder, setPlaceholder] = useState(label)

    const labelStyle = {
        position: "absolute",
        marginTop: "-13px",
        marginLeft: "6px",
        zIndex: "1",
        backgroundColor: "#fff",
        fontSize: "14px",
        color: color,
        display: (placeholder.length ? "none":"inline-block")
    }

    const handleFocus = () => {
        setPlaceholder("")
            
    }
    const handleBlur = () => {
        setPlaceholder(label)
    }

    return (
        <div>
            <label style={labelStyle} htmlFor={name}>{label}</label>
            <input type={type} onFocus={handleFocus} onBlur={handleBlur} name={name} id={name} onChange={handleChange} placeholder={placeholder} value={value}/>
        </div>
    )
}

export default CustomInput;