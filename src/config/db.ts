import dotenv from "dotenv";
import {Pool} from 'pg';

dotenv.config();

const pool = new Pool({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    max: 20,
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
})

pool.on('connect', () => {
    console.info('📦 Nouveau client connecté à la BDD');
});

export default pool;

