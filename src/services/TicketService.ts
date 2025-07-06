import api from "../config/api/axios.api";
import { Ticket } from "../types";


const TicketService = {
    getAllTickets: async () => {
        const response = await api.get<Ticket[]>(`/tickets`);
        return response.data;
    },
    getTicketById: async (id: string) => {
        const response = await api.get<Ticket>(`/tickets/${id}`);
        return response.data;
    }
}

export default TicketService
