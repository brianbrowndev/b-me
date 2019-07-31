import Api from './Api';

type places = 'raleigh'

export const OrgApi = {
    getPlaces(name:places): Promise<string> {
        return Api.getText(`api/org/life/places/${name}`);
    },

}

export default OrgApi;
