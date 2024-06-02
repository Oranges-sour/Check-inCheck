import { sql_get_all_list, sql_quer_check_list } from "./sql.js"
import { ROOM_ID_RANGE } from "./data.js";
import { decrypt, encrypt } from "./security.js";

export class p_get_check_statistics {
    constructor() {

    }

    want_catch(params) {
        return params == "get_check_statistics";
    }

    process(ws, params) {
        let range = ROOM_ID_RANGE.get(-1);

        sql_get_all_list((result) => {

            let li = [];
            for (let k of result) {
                let oo = k.match(/\d+(\.\d+)?/g);
                li.push([parseInt(oo[0]), parseInt(oo[1]), parseInt(oo[2])]);
            }

            let resu = []

            for (let k of li) {

                sql_quer_check_list(range[0], range[1], k[0], k[1], k[2], (result) => {
                    resu.push(result);

                    check_and_calc_and_send();
                });


            }

            function check_and_calc_and_send() {
                if (resu.length != li.length) {
                    return;
                }

                let absence_rate = [];//缺勤率
                let leave_rate = []; //请假率
                for (let k of resu) {
                    let count_absence = 0;
                    let count_leave = 0;
                    for (let j of k) {
                        if (j == 0) {
                            count_absence += 1;
                        }
                        if (j == 2) {
                            count_leave += 1;
                        }
                    }
                    absence_rate.push(parseInt(100.0 * count_absence / (k.length - count_leave)));
                    leave_rate.push(parseInt(100.0 * count_leave / k.length));
                }

                ws.send(encrypt(JSON.stringify([li, absence_rate, leave_rate])));
                ws.close();
            }
        });


    }
}