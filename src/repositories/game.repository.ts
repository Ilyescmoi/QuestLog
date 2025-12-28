import pool from '../config/db';
import { Game } from '../models/game.model';
import { sql } from '../config/db-utils';
import { GameDTO, UpdateGameDTO } from '../dtos/game.dto';

export class GameRepository {
    static async create(gameData: GameDTO): Promise<Game> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const { title, studio, pegi, summary, cover_url, release_date, platformIds } = gameData;

            const gameQuery = sql`
                INSERT INTO games (title, studio, pegi, summary, cover_url, release_date)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const gameResult = await client.query(gameQuery, [
                title,
                studio,
                pegi,
                summary,
                cover_url,
                release_date,
            ]);
            const newGame = gameResult.rows[0];

            if (platformIds && platformIds.length > 0) {
                const linkQuery = sql`
                    INSERT INTO game_platforms (game_id, platform_id)
                    VALUES ($1, $2);
                `;

                for (const platformId of platformIds) {
                    await client.query(linkQuery, [newGame.id, platformId]);
                }
            }

            await client.query('COMMIT');

            return newGame;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async update(id: number, gameData: UpdateGameDTO): Promise<Game | null> {
        const client = await pool.connect(); // Transaction nécessaire !

        try {
            await client.query('BEGIN');

            const { title, studio, pegi, summary, cover_url, release_date, platformIds } = gameData;

            const updateQuery = sql`
                UPDATE games
                SET title        = COALESCE($2, title),
                    studio       = COALESCE($3, studio),
                    pegi         = COALESCE($4, pegi),
                    summary      = COALESCE($5, summary),
                    cover_url    = COALESCE($6, cover_url),
                    release_date = COALESCE($7, release_date)
                WHERE id = $1
                RETURNING *;
            `;

            const result = await client.query(updateQuery, [
                id,
                title,
                studio,
                pegi,
                summary,
                cover_url,
                release_date,
            ]);

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const updatedGame = result.rows[0];

            if (platformIds !== undefined) {
                const deleteQuery = sql`DELETE
                                        FROM game_platforms
                                        WHERE game_id = $1`;
                await client.query(deleteQuery, [id]);

                if (platformIds.length > 0) {
                    const linkQuery = sql`INSERT INTO game_platforms (game_id, platform_id)
                                          VALUES ($1, $2)`;
                    for (const pid of platformIds) {
                        await client.query(linkQuery, [id, pid]);
                    }
                }
            }

            await client.query('COMMIT');
            return updatedGame;
        } catch (error: any) {
            await client.query('ROLLBACK');

            if (error.code === '23505') {
                // Unique violation
                throw new Error(`Conflit de données (Titre déjà existant ?).`);
            }
            console.error('Update Error:', error);
            throw new Error('Erreur lors de la mise à jour du jeu.');
        } finally {
            client.release();
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const query = sql`DELETE
                              FROM games
                              WHERE id = $1`;
            const result = await pool.query(query, [id]);

            // noinspection RedundantIfStatementJS
            if ((result.rowCount ?? 0) > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            console.error('Erreur SQL critique :', error);
            throw new Error('Impossible de supprimer le jeu.');
        }
    }

    static async getAllGames(): Promise<Game[]> {
        try {
            const query: string = sql`SELECT g.*,
                                             JSON_AGG(JSON_BUILD_OBJECT('id', p.id, 'name', p.name, 'slug', p.slug)) AS platforms
                                      FROM games g
                                               LEFT JOIN game_platforms gp ON g.id = gp.game_id
                                               LEFT JOIN platforms p ON gp.platform_id = p.id
                                      GROUP BY g.id;`;

            const result = await pool.query(query);

            return result.rows;
        } catch (error: any) {
            console.error('Erreur lors de la récupération des jeux :', error);
            throw new Error('Impossible de récupérer la liste des jeux.');
        }
    }
}
