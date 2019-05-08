// import { Auth } from "./Auth";

export const Api = {
    get<T>(endpoint:string) {
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
    post<T>(endpoint:string, data:any) {
        let config = {headers:{}, method: 'POST', body: JSON.stringify(data)}

        let token = localStorage.getItem('access_token') || null
        config.headers = { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" }

        return fetch(`${process.env.REACT_APP_API}/${endpoint}`, config)
            .then(r => {
                if (r.ok) {
                    return r.json() as Promise<T>;
                }
                throw new Error('Network response failed')});
    }
}

export default Api;
