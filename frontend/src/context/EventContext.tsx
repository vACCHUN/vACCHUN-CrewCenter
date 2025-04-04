import { createContext } from "react";
import { EventContextParams } from "../types/events";

const EventContext = createContext<EventContextParams | null>(null);
export default EventContext;
