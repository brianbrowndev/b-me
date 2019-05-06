
interface Event {
    id: number,
    name: string,
    date: Date,
    important: boolean,
    reoccuringType: string,
    location: string,
    url: string,
    userId: number
};


export default Event;