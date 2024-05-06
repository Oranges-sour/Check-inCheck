import { NAME_LIST } from "./data.js";

import {
    sql_create_database,
    sql_create_table,
    sql_insert_namelist,
    sql_use_database
} from "./sql.js"


console.log("Start Setup.");

sql_create_database(() => {
    console.log("create_database Finish");
});
sql_use_database(() => {
    console.log("use_database Finish")
});
sql_create_table(() => {
    console.log("create_table Finish")
});
sql_insert_namelist(NAME_LIST, () => {
    console.log("insert_namelist Finish")
});

console.log('Ok');