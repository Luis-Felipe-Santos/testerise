import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1695075480734 } from "./migrations/1695075480734-CreateUsersTable";
import { CreatePlansTable1695159811050 } from "./migrations/1695159811050-CreatePlansTable";
import User from '../app/entities/User';
import Plan from '../app/entities/Plan';

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "project_rise",
  synchronize: true,
  logging: false,
  entities: [User, Plan], 
  migrations: [CreateUsersTable1695075480734, CreatePlansTable1695159811050], 
  subscribers: [],
});