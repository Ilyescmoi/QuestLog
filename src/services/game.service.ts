import { GameDTO, UpdateGameDTO } from '../dtos/game.dto';
import { Game } from '../models/game.model';
import { GameRepository } from '../repositories/game.repository';

export class GameService {
    static async getAllGames(): Promise<Game[]> {
        return await GameRepository.getAllGames();
    }

    static async getByTitle(title: string): Promise<Game> {
        const game = await GameRepository.findByTitle(title);

        if (!game) {
            throw new Error('GameNotFound');
        }
        return game;
    }
    static async create(game: GameDTO): Promise<Game> {
        if (game.release_date && new Date(game.release_date).getFullYear() < 1958) {
            throw new Error("Impossible de créer un jeu avant 1958 (Pong n'existait même pas !)");
        }

        const newGame = await GameRepository.create(game);

        return newGame;
    }

    static async update(game: UpdateGameDTO, id: number): Promise<Game> {
        if (game.release_date && new Date(game.release_date).getFullYear() < 1958) {
            throw new Error(
                "Impossible de modifier un jeu avant 1958 (Pong n'existait même pas !)",
            );
        }

        const updatedGame = await GameRepository.update(id, game);

        if (!updatedGame) {
            throw new Error('GameNotFound');
        }

        return updatedGame;
    }

    static async delete(id: number): Promise<boolean> {
        return await GameRepository.delete(id);
    }
}
