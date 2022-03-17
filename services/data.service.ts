import { connect } from 'mongoose';

class DBConnection {
    constructor() {
        connect(process.env.DATABASE_CONN_STRING!).then().catch();
    }
}

export const dbConnection = new DBConnection();