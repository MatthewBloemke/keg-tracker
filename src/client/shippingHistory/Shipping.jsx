import React, { useEffect, useState } from 'react'
import { getShippingHistory } from '../utils/api'
import FormatShipping from './FormatShipping'
//add component for checking how many kegs shipped during timeframe


const Shipping = ({monthlyOnly}) => {
    const [shipping, setShipping] = useState([])
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        const abortController = new AbortController()
        const loadShippingHistory = async () => {
            await getShippingHistory(abortController.signal)
                .then(setShipping)
        }
        loadShippingHistory()
        return () => abortController.abort()
    }, [])

    return (
        <div>
            {monthlyOnly ? <h1>Monthly</h1> : <h1>Daily</h1>}
            <FormatShipping shippingList={shipping} date={date} monthlyOnly={monthlyOnly}/>            
        </div>

    )
}

export default Shipping;