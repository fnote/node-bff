/**
 * Business unit table DAO functions
 *
 * @author: adis0892 on 27/08/20
 * */

import {closeConnection, getConnection} from "../database/databaseConnection";
import DatabaseException from "../exception/databaseException";
import logger from '../util/logger';

class BusinessUnitDao {
    getBusinessUnitDetails = async () => {
        let connection
        try {
            connection = await getConnection();

            const [rows, fields] = await connection.execute('SELECT bunit_id, bunit_name, periscope_on from business_unit');

            return rows;

        } catch (e) {
            const errorMessage = 'Failed to load business unit table data';
            logger.error(`${errorMessage} due to: ${e}, stacktrace: ${e.stack}`);
            throw new DatabaseException(
                errorMessage,
                e.message,
            );
        } finally {
            if (connection) {
                closeConnection(connection);
            }
        }
    }
}

export default new BusinessUnitDao();