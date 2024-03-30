import { Request } from 'express';
import { Database } from "../util/database/Database"
export default interface ExtendedRequest extends Request {
    database: Database
}