// based off of: https://github.com/Picturepark/Picturepark.SDK.TypeScript/tree/master/src/picturepark-sdk-v1-fetch
export class ApiClientBase {
  constructor() {

  }

  getBaseUrl(defaultUrl: string, requestUrl?: string) {
    return process.env.REACT_APP_API ? process.env.REACT_APP_API : defaultUrl;
  }

  transformHttpRequestOptions(options: RequestInit): Promise<RequestInit> {
    let token = localStorage.getItem('access_token') || null;
    if (options.headers && token) {
        options.headers = { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" }
    }

    return Promise.resolve(options);
  }

  transformOptions(options: RequestInit): Promise<RequestInit> {
    return this.transformHttpRequestOptions(options);
  }
}