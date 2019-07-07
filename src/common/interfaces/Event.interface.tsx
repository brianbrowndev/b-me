
interface Event {
    id: number;
    name: string;
    date?: string;
    important: boolean;
    time: string;
    complete: boolean;
    // important: boolean,
    // reoccuringType: string,
    // location: string,
    // url: string,
    EventUser?: {
        id: number;
        authId: string;
        name: string;
    }
};


export default Event;