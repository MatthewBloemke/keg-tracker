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
            throw payload.error;
        };
        return payload.data;
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error.stack);
            throw error;
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

export async function getKegs() {
    return await fetchJson(`/api/kegs`, {headers}, []);
};

export async function loginCheck() {
    return await fetchJson(`/api/distributors`, {headers}, [])
};



export async function getShippingHistory(signal) {
    return await fetchJson(`/api/shipping`, {headers, signal}, [])
}

export async function createKeg(data) {
    const options = {
        method: "POST",
        headers,
        body: JSON.stringify({data})
    }
    await fetch(`/api/kegs`, options)
}

export async function createHistory(data) {
    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({data})
    }
    return await fetch(`/api/shipping`, options)
}
export async function verifyKeg(data) {
    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/kegs/verify`, options)
}

export async function editKeg(data, keg_id) {
    const options = {
        method: 'PUT',
        headers,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/kegs/${keg_id}`, options)
}
export async function trackKeg(data, keg_id) {
    const options = {
        method: 'PUT',
        headers,
        body: JSON.stringify({data})
    }
    return await fetchJson(`/api/kegs/track/${keg_id}`, options)
}

export async function readKeg(kegName) {
    return await fetchJson(`/api/kegs/${kegName}`)
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
    return await fetch(`/api/distributors`, options)
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
    return await fetch(`/api/employees`, options)
}

export async function updateEmployee(data, employee_id, signal) {
    const options = {
        method: "PUT",
        headers,
        signal,
        body: JSON.stringify({data})
    }
    return await fetch(`/api/employees/${employee_id}`, options)
}

export async function resetPassword(data, employee_id) {
    const options = {
        method: "PUT",
        headers,
        body: JSON.stringify({data})
    }
    return await fetch(`/api/employees/${employee_id}/reset`, options)
}

export async function readEmployee(employee_id, signal) {
    return await fetchJson(`/api/employees/${employee_id}`, {headers, signal})
}

export async function deleteEmployee(employee_id) {
    const options = {
        method: "DELETE",
        headers
    }
    return await fetch(`/api/employees/${employee_id}`, options);
}

export async function logout() {
    return await fetch(`/api/employees/logout`)
}