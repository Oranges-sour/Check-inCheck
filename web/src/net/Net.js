import { encrypt, decrypt } from "@/tools/tools.js";

export function web_get_active_date(call_back) {
    web_send_get("get_active_date", [], call_back);
}

export function web_set_active_date(year, month, day, call_back) {
    web_send_get("set_active_date", [year, month, day], call_back);
}

export function web_get_name_list(room_number, call_back) {
    web_send_get("get_name_list", [room_number], call_back);
}

export function web_get_check_list(room_number, year, mon, day, call_back) {
    web_send_get("get_check_list", [room_number, year, mon, day], call_back);
}

export function web_update_check_list(room_number, year, mon, day, new_list, call_back) {
    web_send_get("update_check_list", [room_number, year, mon, day, new_list], call_back);
}


function web_send_get(event, data, call_back) {
    let web = new WebSocket("ws://localhost:23456");
    let trial = 0;

    web.onopen = function (_) {
        web.send(encrypt(JSON.stringify([event, data])));
        trial += 1;
    };

    web.onmessage = function (ev) {
        let msg = decrypt(ev.data);
        let income = JSON.parse(msg);
        if (income === undefined || income === null) {
            if (trial <= 3) {
                web.send(encrypt(JSON.stringify([event, data])));
                trial += 1;
            } else {
                web.close();
            }

            return;
        }
        call_back(income);
    }
}


