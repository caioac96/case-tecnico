import { DataSource } from "typeorm";
import env from "./config/env";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: env.pg.url,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
    synchronize: true,
    logging: false,
    entities: [__dirname + "/entities/*.{ts,js}"],
    extra: {
        max: 10
    }
});