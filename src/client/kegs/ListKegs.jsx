import React, { useEffect, useState } from 'react'
import { getDistributors, getKegs } from '../utils/api'
import FormatKegs from './FormatKegs'
import "./ListKegs.css"

//todo: add more comprehensive filter options

const ListKegs = () => {
    const [filter, setFilter] = useState("status") //date, size, status
    const [kegs, setKegs] = useState([])
    const [distributors, setDistributors] = useState([])
    useEffect(() => {
        const abortController = new AbortController()
        if (filter === "size") {
            kegs.sort((a, b) => a.keg_size - b.keg_size)
        } else if (filter === "date") {
            kegs.sort((a, b) => a.date_shipped > b.date_shipped)
        } else if (filter === "status") {
            kegs.sort((a, b) => a.keg_status > b.keg_status)
        }
        getDistributors(abortController.signal)
            .then(setDistributors)
        getKegs(window.location.origin)
            .then(response => {
                if (filter === "size") {
                    response.sort((a, b) => a.keg_size.localeCompare(b.keg_size))
                } else if (filter === "date") {
                    response.sort((a, b) => new Date(b.date_shipped) - new Date(a.date_shipped))
                } else if (filter === "status") {
                    response.sort((a, b) => b.keg_status.localeCompare(a.keg_status))
                }
                setKegs(response)
            })
    }, [])

    return (
        <FormatKegs kegs={kegs} distributors={distributors}/>
    )
}

export default ListKegs