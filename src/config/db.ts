import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    max: 20,
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

pool.on('connect', () => {
    console.info('📦 Nouveau client connecté à la BDD');
});

export default pool;
