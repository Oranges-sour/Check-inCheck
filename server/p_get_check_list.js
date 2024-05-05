import { sql_quer_check_list, sql_get_all_list } from "./sql.js"
import { ROOM_ID_RANGE } from "./data.js";
import { decrypt, encrypt } from "./security.js";

export class p_get_check_list {
    constructor() {

    }

    want_catch(params) {
        return params == "get_check_list";
    }

    process(ws, params) {
        let range = ROOM_ID_RANGE.get(params[0]);

        let year = params[1];
        let mon = params[2];
        let day = params[3];

        sql_get_all_list((result) => {
            
            let s_mon = mon < 10 ? `0${mon}` : `${mon}`;
            let s_day = day < 10 ? `0${day}` : `${day}`;
            if (result.includes(`check_${year}_${s_mon}_${s_day}`)) {
                
                sql_quer_check_list(range[0], range[1], year, mon, day, (result) => {

                    ws.send(encrypt(JSON.stringify(result)));
                    ws.close();
                });

                return;
            }
            ws.send(encrypt(JSON.stringify([])));
            ws.close();
        });
        


    }
}