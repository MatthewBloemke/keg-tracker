import {useHistory} from'react-router-dom'

const headers = new Headers();
headers.append("Content-Type", "application/json");

const fetchJson = async (url, options, onCancel) => {
    const history = useHistory()
    try {
        const response = await fetch(url, options);

        if (response.status=== 204) {
            return null
        } else if (response.status === 401) {
            history.push("/login")
            return undefined
        }
        const payload = await response.json()

        if (payload.error) {
            throw payload.error
        }
        //console.log(payload.data)
        return payload.data;
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error.stack)
            throw error;
        }
        return onCancel
    }
}


export async function isLoggedIn () {
    await fetchJson('http://localhost:5000/api/employees', {headers} )
        .then(response => {
            if (response===401) {
                history.push('/login')
            }
        })
}

export async function getKegs(baseUrl) {
    return await fetchJson(`${baseUrl}/api/kegs`, {headers}, []) 
}