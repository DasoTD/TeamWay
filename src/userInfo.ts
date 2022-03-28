import { Request} from 'express'
export interface userInfo extends Request {
    user: any,
    header: any,
}