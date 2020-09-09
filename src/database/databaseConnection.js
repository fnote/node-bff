/**
 * Database connection
 *
 * @author: adis0892 on 27/08/20
 * */

import mysql from 'mysql2/promise'
import {getSsmConfig} from "../service/aws/ssmService";


const getConnection = async () => {
    const host = await getSsmConfig('commonDbURL');
    const user = await getSsmConfig('commonDbUsername');
    const password = await getSsmConfig('commonDbPassword');

    return mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: `${process.env.COMMON_DB_NAME}`
    });
}

const closeConnection = (conn) => {
    conn.end();
}

export {
    getConnection,
    closeConnection
};