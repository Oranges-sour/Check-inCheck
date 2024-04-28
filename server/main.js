import { WebSocketServer } from "ws";



let wss = new WebSocketServer({ port: 23456 });

import { } from "./sql.js"

import { decrypt, encrypt } from "./security.js";

import { p_get_name_list } from "./p_get_name_list.js";
import { p_get_check_list } from "./p_get_check_list.js";
import { p_update_check_list } from "./p_update_check_list.js";
import { p_get_active_date } from "./p_get_active_date.js";
import { p_set_active_date } from "./p_set_active_date.js"

let command =
    [new p_get_name_list(),
    new p_get_check_list(),
    new p_update_check_list(),
    new p_get_active_date(),
    new p_set_active_date()];

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




