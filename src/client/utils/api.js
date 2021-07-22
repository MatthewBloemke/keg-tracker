import {useHistory} from'react-router-dom'

const headers = new Headers();
headers.append("Content-Type", "application/json");

const fetchJson = async (url, options, onCancel) => {
    try {
        const response = await fetch(url, options);

        if (response.status=== 204) {
            return null
        } else if (response.status === 401) {
            return undefined
        }
        const payload = await response.json()

        if (payload.error) {
            return Promise.reject({message: payload.error})
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error.stack)
            throw error;
        }
        return Promise.resolve(onCancel)
    }
}


export async function isLoggedIn () {
    const history = useHistory()
    const abortController = new AbortController
    const signal = abortController.signal
    await fetchJson('http://localhost:5000/api/kegs', {headers, signal} )
        .then(response => {
            console.log(response)
            if (response.status===401) {
                history.push('/login')
            }
        })
}