import { sql_drop_date, sql_get_all_list } from "./sql.js"
import { ROOM_ID_RANGE } from "./data.js";
import { decrypt, encrypt } from "./security.js";

export class p_drop_check_list {
    constructor() {

    }

    want_catch(params) {
        return params == "drop_check_list";
    }

    process(ws, params) {

        let year = params[0];
        let mon = params[1];
        let day = params[2];

        sql_get_all_list((result) => {
            let s_mon = mon < 10 ? `0${mon}` : `${mon}`;
            let s_day = day < 10 ? `0${day}` : `${day}`;
            if (result.includes(`check_${year}_${s_mon}_${s_day}`)) {

                sql_drop_date(year, mon, day, () => {
                    ws.send(encrypt(JSON.stringify(["ok", ""])));
                    ws.close();
                });

                return;
            }
            ws.send(encrypt(JSON.stringify(["error","<drop_check_list>:Column not found!"])));
            ws.close();
        });




    }
}