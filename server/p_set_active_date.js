import { ACTIVE_DATE } from "./data.js";
import { decrypt, encrypt } from "./security.js";

export class p_set_active_date {
    constructor() {

    }

    want_catch(params) {
        return params == "set_active_date";
    }

    process(ws, params) {
        let year = params[0];
        let mon = params[1];
        let day = params[2];

        ACTIVE_DATE.year = year;
        ACTIVE_DATE.month = mon;
        ACTIVE_DATE.day = day;

        ws.send(encrypt(JSON.stringify([])));
        ws.close();
    }
}