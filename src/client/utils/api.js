const headers = new Headers();
headers.append("Content-Type", "application/json");

const fetchJson = async (url, options, onCancel) => {
    try {
        const response = await fetch(url, options);

        if (response.status === 204) {
            return null;
        } else if (response.status === 401) {
            return undefined;
        };
        const payload = await response.json();
        if (payload.error) {
            return {status: response.status, error: payload.error};
        };
        return payload.data;
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error.stack);
            return {status: response.status, error};
        };
        return onCancel;
    };
};

export async function login(data, signal) {
    const options = {
        method: "POST",
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson('/api/login', options, [])
}

export async function getKegs(signal) {
    return await fetchJson(`/api/kegs`, {headers, signal}, []);
};

export async function loginCheck() {
    return await fetchJson(`/api/distributors`, {headers}, [])
};



export async function getShippingHistory(signal) {
    return await fetchJson(`/api/shipping`, {headers, signal}, [])
}

export async function createKeg(data, signal) {
    const options = {
        method: "POST",
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/kegs`, options, [])
}

export async function createHistory(data, signal) {
    const options = {
        method: 'POST',
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/shipping`, options)
}
export async function verifyKeg(data, signal) {
    const options = {
        method: 'POST',
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/kegs/verify`, options)
}

export async function editKeg(data, keg_id, signal) {
    const options = {
        method: 'PUT',
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/kegs/${keg_id}`, options)
}
export async function trackKeg(data, keg_id, signal) {
    const options = {
        method: 'PUT',
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/kegs/track/${keg_id}`, options)
}

export async function readKeg(kegId, signal) {
    return await fetchJson(`/api/kegs/${kegId}`, {headers, signal})
}

//Distributor Functions

export async function getDistributors(signal) {
    return await fetchJson(`/api/distributors`, {headers, signal}, [])
}

export async function createDistributor(data, signal) {
    const options = {
        method: "POST",
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/distributors`, options)
}

export async function editDistributor(data, distributor_id, signal) {
    const options = {
        method: "PUT",
        headers, 
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/distributors/${distributor_id}`, options)
}

export async function updateDaysOut(data, distributor_id, signal) {
    const options = {
        method: "PUT",
        headers, 
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/distributors/daysOut/${distributor_id}`, options)
}

export async function readDistributor(distributor_id, signal) {
    return await fetchJson(`/api/distributors/${distributor_id}`, {headers, signal}, [])
}

//Employees functions

export async function getEmployees(signal) {
    return await fetchJson(`/api/employees`, {headers, signal})
}

export async function createEmployee(data, signal) {
    const options = {
        method: "POST",
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/employees`, options)
}

export async function updateEmployee(data, employee_id, signal) {
    const options = {
        method: "PUT",
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/employees/${employee_id}`, options)
}

export async function resetPassword(data, employee_id, signal) {
    const options = {
        method: "PUT",
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/employees/${employee_id}/reset`, options)
}

export async function readEmployee(employee_id, signal) {
    return await fetchJson(`/api/employees/${employee_id}`, {headers, signal})
}

export async function deleteEmployee(employee_id, signal) {
    const options = {
        method: "DELETE",
        headers,
        signal
    }
    return await fetchJson(`/api/employees/${employee_id}`, options);
}

export async function logout(signal) {
    return await fetchJson(`/api/employees/logout`, {headers, signal})
}