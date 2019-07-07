// import { Auth } from "./Auth";

export const Api = {
    get<T>(endpoint:string): Promise<T> {
        let config = {headers:{}}

        let token = localStorage.getItem('access_token') || null
        config.headers = { 'Authorization': `Bearer ${token}` }

        return fetch(`${process.env.REACT_APP_API}/${endpoint}`, config)
            .then(r => {
                if (r.ok) {
                    return r.json() as Promise<T>;
                }
                throw new Error('Network response failed')});
    },
    post<T>(endpoint:string, data:{[key:string]:any}): Promise<T> {
        let config = {headers:{}, method: 'POST', body: JSON.stringify(data)}

        let token = localStorage.getItem('access_token') || null
        config.headers = { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" }

        return fetch(`${process.env.REACT_APP_API}/${endpoint}`, config)
            .then(r => {
                if (r.ok) {
                    return r.json() as Promise<T>;
                }
                throw new Error('Network response failed')});
    },
    put<T>(endpoint:string, data:{[key:string]:any}): Promise<T | null> {
        let config = {headers:{}, method: 'PUT', body: JSON.stringify(data)}

        let token = localStorage.getItem('access_token') || null
        config.headers = { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" }

        return fetch(`${process.env.REACT_APP_API}/${endpoint}`, config)
            .then(r => {
                if (r.ok) {
                    // check if there is a body on the response, otherwise return null
                    // empty response in case of 204
                    return r.text().then(content => {
                        return content.length > 0 ? JSON.parse(content) : null; 
                    })
                }
                throw new Error('Network response failed')});
    }
}

export default Api;
