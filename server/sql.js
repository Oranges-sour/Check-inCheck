import { createConnection } from "mysql";

import { DATABASE_NAME, TABLE_NAME } from "./data.js";


let con = createConnection({
    host: "localhost",
    user: "root",
    password: "123456"
});

con.connect((err) => {
    if (err) throw err;

    //防止数据库掉线
    setInterval(function () {
        con.query('SELECT 1');
    }, 10000);

});


export function sql_drop_database(call_back) {
    const sql = `DROP DATABASE IF EXISTS ${DATABASE_NAME};`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        call_back();
    });
}

export function sql_create_table(call_back) {
    const sql = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                 id INT PRIMARY KEY,
                 name VARCHAR(30) NOT NULL
                 ) 
                 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
                 ;`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        call_back();
    });
}

export function sql_use_database(call_back) {
    const sql = `USE ${DATABASE_NAME}
                 ;`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        call_back();
    });
}

export function sql_create_database(call_back) {
    const sql = `CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}
                 CHARACTER SET utf8mb4
                 COLLATE utf8mb4_general_ci
                 ;`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        call_back();
    });
}




export function sql_insert_namelist(name_list, call_back) {
    for (let [idx, it] of name_list.entries()) {


        const sql = `INSERT INTO ${TABLE_NAME} (id, name) VALUES (${idx + 1},'${it}');`;

        con.query(sql, function (err, result) {
            if (err) throw err;
            call_back();
        });
    }
}

//添加新的检查日期
//eg: 2003 01 07
export function sql_insert_date(year, mon, day, call_back) {
    let s_mon = mon < 10 ? `0${mon}` : `${mon}`;
    let s_day = day < 10 ? `0${day}` : `${day}`;

    const sql = `ALTER TABLE ${TABLE_NAME} ADD COLUMN
                 check_${year}_${s_mon}_${s_day}
                 INT NOT NULL;`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        call_back();
    });
}

export function sql_drop_date(year, mon, day, call_back) {
    let s_mon = mon < 10 ? `0${mon}` : `${mon}`;
    let s_day = day < 10 ? `0${day}` : `${day}`;

    const sql = `ALTER TABLE ${TABLE_NAME} DROP COLUMN
                 check_${year}_${s_mon}_${s_day}
                 ;`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        call_back();
    });
}


// [id_begin, id_end]
export function sql_quer_name(id_begin, id_end, call_back) {
    const sql = `SELECT name FROM ${TABLE_NAME} 
                 WHERE id BETWEEN ${id_begin} AND ${id_end}
                 ;`;
    con.query(sql, function (err, result) {
        if (err) throw err;

        let li = []
        for (let i = 0; i < id_end - id_begin + 1; ++i) {
            li.push(result[i].name);
        }
        call_back(li);
    });
}

// [id_begin, id_end]
export function sql_quer_check_list(id_begin, id_end, year, mon, day, call_back) {
    let s_mon = mon < 10 ? `0${mon}` : `${mon}`;
    let s_day = day < 10 ? `0${day}` : `${day}`;

    const sql = `
                SELECT check_${year}_${s_mon}_${s_day} FROM ${TABLE_NAME}
                 WHERE id BETWEEN ${id_begin} AND ${id_end}
                 ;`;


    con.query(sql, function (err, result) {
        if (err) throw err;

        let li = []
        for (let i = 0; i < id_end - id_begin + 1; ++i) {
            li.push(result[i][`check_${year}_${s_mon}_${s_day}`]);
        }
        call_back(li);
    });
}

export function sql_update_check_list(id_begin, id_end, year, mon, day, new_list, call_back) {
    let s_mon = mon < 10 ? `0${mon}` : `${mon}`;
    let s_day = day < 10 ? `0${day}` : `${day}`;

    for (let i = 0; i < id_end - id_begin + 1; ++i) {
        let id = i + id_begin;
        const sql = `UPDATE ${TABLE_NAME} 
                     SET check_${year}_${s_mon}_${s_day} = ${new_list[i]}
                     WHERE id = ${id}
                     ;`;

        con.query(sql, function (err, result) {
            if (err) throw err;

            call_back();
        });

    }
}

export function sql_get_all_list(call_back) {
    const sql = `DESCRIBE ${TABLE_NAME} 
                 ;`;

    con.query(sql, function (err, result) {
        if (err) throw err;

        let li = [];
        for (let k of result) {
            let f = k["Field"];
            if (f.startsWith("check_")) {
                li.push(f);
            }
        }

        call_back(li);

    });
}

////////////////////////////////////






