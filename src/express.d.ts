import { Request } from 'express';
import IUser from "./app/interfaces/IUser";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}