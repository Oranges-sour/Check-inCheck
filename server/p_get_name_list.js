import { sql_quer_name } from "./sql.js"
import { ROOM_ID_RANGE } from "./data.js";
import { decrypt, encrypt } from "./security.js";

export class p_get_name_list {
    constructor() {

    }

    want_catch(params) {
        return params == "get_name_list";
    }

    process(ws, params) {
        let range = ROOM_ID_RANGE.get(params[0]);
        sql_quer_name(range[0], range[1], (result) => {

            ws.send(encrypt(JSON.stringify(result)));
            ws.close();
        });


    }
}