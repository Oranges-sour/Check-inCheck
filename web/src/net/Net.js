import { encrypt, decrypt } from "@/tools/tools.js";

export function web_get_check_statistics(call_back) {
    web_send_get("get_check_statistics", [], call_back);
}

export function web_check_admin_password(password, call_back) {
    web_send_get("check_admin_password", [password], call_back);
}

export function web_drop_check_list(year, month, day, call_back) {
    web_send_get("drop_check_list", [year, month, day], call_back);
}

export function web_insert_check_list(year, month, day, call_back) {
    web_send_get("insert_check_list", [year, month, day], call_back);
}

export function web_get_all_list(call_back) {
    web_send_get("get_all_list", [], call_back);
}

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


function web_send_get_1(event, data, call_back, connection_trial_times) {
    let web = new WebSocket("ws://localhost:23456");
    web.onerror = function (_) {
        web.close();
        if (connection_trial_times >= 3) {
            call_back(undefined);
            return;
        }
        setTimeout(() => {
            web_send_get_1(event, data, call_back, connection_trial_times + 1);
        }, 1000);
    }
    let send_trial = 0;

    web.onopen = function (_) {
        web.send(encrypt(JSON.stringify([event, data])));
        send_trial += 1;
    };

    web.onmessage = function (ev) {
        let msg = decrypt(ev.data);
        let income = JSON.parse(msg);
        if (income === undefined || income === null) {
            if (send_trial <= 3) {
                web.send(encrypt(JSON.stringify([event, data])));
                send_trial += 1;
            } else {
                web.close();
            }

            return;
        }
        call_back(income);
        web.close();
    }
}


function web_send_get(event, data, call_back) {
    web_send_get_1(event, data, call_back, 1);
}


