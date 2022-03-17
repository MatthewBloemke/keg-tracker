import React from 'react'

const DistAsSelect = ({dist}) => {
    let distOptions = [<option key="default">Select distributor</option>]
    
    dist.forEach(item => {
        distOptions.push(
            <option key={item.distributor_id} value={item.distributor_id}>{item.distributor_name}</option>
        )                
    })

    return distOptions

    
    
}

export default DistAsSelect;