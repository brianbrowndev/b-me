import Api from '../../core/Api';
import Event from '../interfaces/Event.interface';

export const EventApi = {
    getEvents(): Promise<Event[]> {
        return Api.get<Event[]>('events');
    },
    postEvent(data:Event): Promise<Event> {
        return Api.post<Event>('events', data);
    }
}

export default EventApi;