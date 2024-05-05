import { ACTIVE_DATE } from "./data.js";
import { encrypt } from "./security.js";

import { sql_get_all_list } from "./sql.js";

export class p_get_all_list {
    constructor() {

    }

    want_catch(params) {
        return params == "get_all_list";
    }

    process(ws, params) {
        sql_get_all_list((result) => {

            let li = [];
            for (let k of result) {
                let oo = k.match(/\d+(\.\d+)?/g);
                li.push([parseInt(oo[0]), parseInt(oo[1]), parseInt(oo[2])]);
            }

            ws.send(encrypt(JSON.stringify(li)));
            ws.close();
        });
    }
}