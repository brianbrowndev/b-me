import { SwaggerException } from ".";

/**
 * IMPORTANT - This was deprecrated but having issues with NSwag not handling text
 * Until text can be properly handled in generated client, will need to use this definition
 * for retriving text org files
 * 
 */


function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if(result !== null && result !== undefined)
        throw result;
    else
        throw new SwaggerException(message, status, response, headers, null);
}

export const Api = {
    getText(endpoint:string): Promise<string> {
        let config = {headers:{}}

        let token = localStorage.getItem('access_token') || null
        config.headers = { 'Authorization': `Bearer ${token}` }
        return fetch(`${process.env.REACT_APP_API}/${endpoint}`, config)
            .then(r => {
        const status = r.status;
        let _headers: any = {}; if (r.headers && r.headers.forEach) { r.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return r.text().then((_responseText) => _responseText);
        } else if (status === 400) {
            return r.text().then((_responseText) => throwException("A server error occurred.", status, _responseText, _headers));
        } else {
            return r.text().then((_responseText) => throwException("A server error occurred.", status, _responseText, _headers));
        }
        })
    },
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
