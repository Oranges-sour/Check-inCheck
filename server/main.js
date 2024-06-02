import { WebSocketServer } from "ws";

import { sql_use_database } from "./sql.js";

import { decrypt, encrypt } from "./security.js";

import { p_get_name_list } from "./p_get_name_list.js";
import { p_get_check_list } from "./p_get_check_list.js";
import { p_update_check_list } from "./p_update_check_list.js";
import { p_get_active_date } from "./p_get_active_date.js";
import { p_set_active_date } from "./p_set_active_date.js"
import { p_get_all_list } from "./p_get_all_list.js";
import { p_insert_check_list } from "./p_insert_check_list.js";
import { p_drop_check_list } from "./p_drop_check_list.js";
import { p_check_admin_password } from "./p_check_admin_password.js"
import { p_get_check_statistics } from "./p_get_check_statistics.js";


let wss = new WebSocketServer({ port: 23456 });

sql_use_database(() => { });

let command =
    [new p_get_name_list(),
    new p_get_check_list(),
    new p_update_check_list(),
    new p_get_active_date(),
    new p_set_active_date(),
    new p_get_all_list(),
    new p_insert_check_list(),
    new p_drop_check_list(),
    new p_check_admin_password(),
    new p_get_check_statistics()];

wss.on("connection", function (ws) {
    ws.on("message", function (e) {
        on_msg(ws, e);
    });


    ws.on("error", function () {
        ws.close();
    });
});

function on_msg(ws, e) {
    let ob = JSON.parse(decrypt(String(e)));
    if (ob === undefined) {
        ws.close();
        return;
    }
    if (ob[0] === undefined || ob[1] === undefined) {
        ws.close();
        return;
    }

    let is_somebody_catch = false;
    for (let co of command) {
        if (co.want_catch(ob[0])) {

            co.process(ws, ob[1]);

            is_somebody_catch = true;
        }
    }

    if (!is_somebody_catch) {
        ws.close();
    }

}




