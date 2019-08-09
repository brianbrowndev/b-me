import Api from './Api';

export const OrgApi = {
    get(url:string): Promise<string> {
        return Api.getText(`api${url}`);
    },

}

export default OrgApi;
