import React, { useEffect, useState } from 'react'
import {getKegs} from '../utils/api'

const Dashboard = () => {
    
    const [kegs, setKegs] = useState([]) 
    const [returnedKegs, setReturnedKegs] = useState([])
    const [sixtyDayKegs, setSixtyDayKegs] = useState([])
    const [onetwentyDayKegs, setOnetwentyDayKegs] = useState([])
    const [overdueKegs, setOverdueKegs] = useState([])

    useEffect(() => {
        const abortController = new AbortController()
        const loadDashboard = async () => {
            const returnedKegsArr = []
            const sixtyDayKegArr = []
            const onetwentyDayKegArr = []
            const overdueKegArr = []
            await getKegs()
                .then(response => {
                    const tempKegs = response
                    for (let i = 0; i < tempKegs.length; i++) {
                        if (tempKegs[i].keg_status === "returned") {
                            returnedKegsArr.push(tempKegs[i])
                        } else {
                            let timeA = new Date();
                            let timeB = new Date(tempKegs[i].date_shipped)
                            let timeDifference = timeA.getTime() - timeB.getTime()
                            let daysDifference = timeDifference/1000/3600/24;
                            if (daysDifference < 60) {
                                sixtyDayKegArr.push(tempKegs[i])
                            } else if (daysDifference < 120) {
                                onetwentyDayKegArr.push(tempKegs[i])
                            } else {
                                overdueKegArr.push(tempKegs[i])
                            }
                        }
                    }
                    setKegs(response)
                    setReturnedKegs(returnedKegsArr)
                    setSixtyDayKegs(sixtyDayKegArr)
                    setOnetwentyDayKegs(onetwentyDayKegArr)
                    setOverdueKegs(overdueKegArr)
                })
        }
        loadDashboard()
        return () => abortController.abort()
    }, [])
    return (
        <div> 
            <h1>This is the dashboard</h1>
            <p>Total Kegs {kegs ? kegs.length : null}</p>
            <p>Kegs returned {returnedKegs ? returnedKegs.length : null}</p>
            <p>Total shipped kegs {returnedKegs ? (kegs.length - returnedKegs.length) : null}</p>
            <p>0-60 Days {sixtyDayKegs ? sixtyDayKegs.length : null}</p>
            <p>60-120 Days {onetwentyDayKegs ? onetwentyDayKegs.length : null}</p>
            <p>120+ Days {overdueKegs ? overdueKegs.length : null}</p>
        </div>
    )
}

export default Dashboard