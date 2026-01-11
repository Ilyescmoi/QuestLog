import { Request, Response } from 'express';
import { GameDTO } from '../dtos/game.dto';
import { GameService } from '../services/game.service';

export class GameController {
    static async create(req: Request, res: Response) {
        try {
            const gameData = req.body as GameDTO;

            if (!gameData.title || !gameData.platformIds) {
                res.status(400).json({
                    message: 'Le titre et la plateforme sont obligatoire',
                });
                return;
            }

            const game = await GameService.create(gameData);
            res.status(201).json(game);
        } catch (error: any) {
            if (
                error.message ==
                "Impossible de créer un jeu avant 1958 (Pong n'existait même pas !)"
            ) {
                res.status(400).json({
                    message: "Impossible de créer un jeu avant 1958 (Pong n'existait même pas !)",
                });
                return;
            }

            if (error.message == 'GameAlreadyExists') {
                res.status(409).json({
                    message: 'Ce jeu existe déjà sur cette plateforme.',
                });
                return;
            }
            console.error('Erreur CreateGame :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }
}
