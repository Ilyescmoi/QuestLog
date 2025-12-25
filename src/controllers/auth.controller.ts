import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                res.status(400).json({
                    message: 'Les champs username, email et password sont requis.',
                });
                return;
            }

            const user = await AuthService.register({ username, email, password });

            res.status(201).json(user);
        } catch (error: any) {
            if (error.message == 'Cet email est déjà utilisé.') {
                res.status(409).json({ message: 'Cet email est déjà utilisé.' });
                return;
            }
            console.error('Erreur Register :', error);
            res.status(500).json({ message: error.message });
        }
    }
}
