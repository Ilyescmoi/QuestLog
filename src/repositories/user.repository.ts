import pool from '../config/db';
import { User } from '../models/user.model';
import { sql } from '../config/db-utils';

export class UserRepository {
    static async create(username: string, email: string, password_hash: string): Promise<User> {
        try {
            const query = sql`INSERT INTO users (username, email, password_hash)
                              VALUES ($1, $2, $3) RETURNING *`;
            const result = await pool.query(query, [username, email, password_hash]);

            return result.rows[0];
        } catch (error: any) {
            if (error.code === '23505') {
                throw new Error('Cet email est déjà utilisé.');
            }

            console.error('Erreur SQL critique :', error);
            throw new Error("Impossible de créer l'utilisateur.");
        }
    }

    static async getAllUsers(): Promise<User[]> {
        throw new Error('Not implemented');
    }

    /* static async getById(id: number): Promise<User> {
        throw new Error('Not implemented');
    }

    static async getByEmail(email: string): Promise<User> {
        throw new Error('Not implemented');
    }

    static async getByUsername(username: string): Promise<User[]> {
        throw new Error('Not implemented');
    }*/
}
