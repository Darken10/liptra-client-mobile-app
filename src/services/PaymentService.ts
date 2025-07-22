import api from "../config/api/axios.api";
import { OrangeMoneyPayementPayload } from "../types/payement.type";

export default class PaymentService {
    static payByOrangeMoney(payload: OrangeMoneyPayementPayload) {
        return api.post('/payement/orange-money', payload);
    }
}
