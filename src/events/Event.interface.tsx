
interface Event {
    id: number,
    name: string,
    date: string,
    time: string,
    important: boolean,
    reoccuringType: string,
    location: string,
    url: string,
    userId: number
};


export default Event;