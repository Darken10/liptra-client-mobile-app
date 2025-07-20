import api from "@/src/config/api/axios.api";
import { payementModeTypeList, Seat, TripFilters, Voyage, VoyageDetail } from "../types";

export default class VoyageService {
    
    
    public static getVoyageList = async ({filters = {}}: {filters?: TripFilters}): Promise<Voyage[]> => {
        return await api.get<Voyage[]>("/trips", {params: filters}).then(response => {
            console.log("response : ", response);
            return  response.data
        })
    }

    public static getVoyageById = async (id: string): Promise<VoyageDetail> => {
        return await api.get(`/trips/${id}`).then(response => response.data)
    }

    public static getPayementModeList = async (): Promise<payementModeTypeList[]> => {
        return await api.get("/payement/mode-list").then(response => response.data)
    }

    public static getSeatList = async (id: string): Promise<Seat[]> => {
        return await api.get(`/trips/${id}/seats`).then(response => response.data)
    }
}
