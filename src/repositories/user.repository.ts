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

    static async update(id: number, username?: string, email?: string): Promise<User | null> {
        try {
            const query = sql`UPDATE users
                              SET username = (COALESCE($2, username)),
                                  email    = (COALESCE($3, email))
                              WHERE id = $1
                              RETURNING *`;
            const result = await pool.query(query, [id, username, email]);

            return result.rows[0] || null;
        } catch (error: any) {
            if (error.code === '23505') {
                throw new Error('Cet email est déjà utilisé.');
            }
            console.error('Update Error:', error);
            throw new Error("Erreur lors de la mise à jour de l'utilisateur.");
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const query = sql`DELETE FROM users WHERE id=$1`;
            const result = await pool.query(query, [id]);

            // noinspection RedundantIfStatementJS
            if ((result.rowCount ?? 0) > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            console.error('Erreur SQL critique :', error);
            throw new Error("Impossible de supprimer l'utilisateur.");
        }
    }

    static async getAllUsers(): Promise<User[]> {
        try {
            const query: string = sql`SELECT *
                                      FROM users`;

            const result = await pool.query(query);

            return result.rows;
        } catch (error: any) {
            console.error('Erreur lors de la récupération des users :', error);
            throw new Error('Impossible de récupérer la liste des utilisateurs.');
        }
    }

    static async getById(id: number): Promise<User | null> {
        try {
            const query: string = sql`SELECT *
                                      FROM users WHERE id = $1;`;

            const result = await pool.query(query, [id]);

            return result.rows[0] || null;
        } catch (error: any) {
            console.error('Erreur lors de la récupération de utilisateur :', error);
            throw new Error('Impossible de récupérer un utilisateur.');
        }
    }

    static async getByEmail(email: string): Promise<User | null> {
        try {
            const query: string = sql`SELECT *
                                      FROM users WHERE email = $1;`;

            const result = await pool.query(query, [email]);

            return result.rows[0] || null;
        } catch (error: any) {
            console.error('Erreur lors de la récupération de utilisateur :', error);
            throw new Error('Impossible de récupérer un utilisateur.');
        }
    }

    static async getByUsername(username: string): Promise<User[]> {
        try {
            const query: string = sql`SELECT *
                                      FROM users WHERE username = $1;`;

            const result = await pool.query(query, [username]);

            return result.rows;
        } catch (error: any) {
            console.error('Erreur lors de la récupération de utilisateur :', error);
            throw new Error('Impossible de récupérer un utilisateur.');
        }
    }
}
