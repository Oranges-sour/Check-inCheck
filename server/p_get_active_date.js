import { ACTIVE_DATE } from "./data.js";
import { encrypt } from "./security.js";

export class p_get_active_date {
    constructor() {

    }

    want_catch(params) {
        return params == "get_active_date";
    }

    process(ws, params) {

        ws.send(
            encrypt(
                JSON.stringify(
                    [ACTIVE_DATE.year, ACTIVE_DATE.month, ACTIVE_DATE.day]
                )));
        ws.close();


    }
}