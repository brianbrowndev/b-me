import Api from './Api';

export const OrgApi = {
    get(url:string): Promise<string> {
        return Api.getText(url);
    },

}

export default OrgApi;
