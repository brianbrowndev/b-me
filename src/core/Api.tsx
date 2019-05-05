import { Auth } from "./Auth";

export const Api = {
    get<T>(endpoint:string) {
        let config = {headers:{}}

        if(Auth.isAuthenticated) {
            let token = localStorage.getItem('access_token') || null
            config.headers = { 'Authorization': `Bearer ${token}` }
        }


        return fetch(`${process.env.REACT_APP_API}/${endpoint}`, config)
            .then(r => {
                if (r.ok) {
                    return r.json() as Promise<T>;
                }
                throw new Error('Network response failed')});
    }
}