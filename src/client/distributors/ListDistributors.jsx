import React, {useEffect, useState} from 'react'
import { getDistributors } from '../utils/api'
import FormatDistributors from './FormatDistributors';

const ListDistributors = () => {
    const [dist, setDist] = useState([]);
    useEffect(() => {
        const abortController = new AbortController()
        const loadDistributors = async () => {
            await getDistributors(abortController.signal)
                .then(setDist)            
        }
        loadDistributors()
        return () => abortController.abort()
    }, [])

    return (
        <FormatDistributors distributors={dist}/>
    )
}

export default ListDistributors;