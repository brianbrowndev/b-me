import Api from './Api';

export const OrgApi = {
    getRaleigh(): Promise<string> {
        return Api.getText('api/org/trips/raleigh');
    },

}

export default OrgApi;
