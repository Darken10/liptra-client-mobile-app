import { payementModeTypeList, Voyage } from "../types";
import api from "./api.call";

export default class VoyageService {
    
    
    public getVoyageList = async (): Promise<Voyage[]> => {
        const response = await api.get("/trips")
        return response.data;
    }

    public getVoyageById = async (id: string): Promise<Voyage> => {
        const response = await api.get(`/trips/${id}`)
        return response.data;
    }

    public getPayementModeList = async (): Promise<payementModeTypeList[]> => {
        const response = await api.get("/payement/mode-list")
        return response.data;
    }
}
