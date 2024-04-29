import { ADMIN_PASSWORD } from "./data.js";
import { encrypt } from "./security.js";

export class p_check_admin_password {

    constructor() {
        this.trial_times = 0;

        this.in_waiting = false;
    }

    want_catch(params) {
        return params == "check_admin_password";
    }

    process(ws, params) {

        if (this.trial_times >= 5) {
            if (this.in_waiting) {
                ws.send(encrypt(JSON.stringify([])));
                ws.close();
                return;
            }

            this.in_waiting = true;
            setTimeout(() => {
                this.in_waiting = false;
                this.trial_times = 0;
            }, 10000);
            ws.send(encrypt(JSON.stringify(['busy'])));
            ws.close();
            return;
        }

        if (params[0] == ADMIN_PASSWORD) {
            ws.send(encrypt(JSON.stringify(['correct'])));
            ws.close();
            return;
        }

        this.trial_times += 1;
        ws.send(encrypt(JSON.stringify(['incorrect'])));
        ws.close();

    }
}
