import Api from '../core/Api';
import Event from './Event.interface';

export const EventApi = {
    getEvents() {
        return Api.get<Event[]>('events');
    },
    postEvent(data:Event) {
        return Api.post<Event>('events', data);
    }
}

export default EventApi;