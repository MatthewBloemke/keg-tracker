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

export async function getKegs(baseUrl) {
    return await fetchJson(`${baseUrl}/api/kegs`, {headers}, []);
};

export async function loginCheck(baseUrl) {
    return await fetchJson(`${baseUrl}/api/distributors`, {headers}, [])
};

export async function getDistributors(baseUrl) {
    return await fetchJson(`${baseUrl}/api/distributors`, {headers}, [])
}