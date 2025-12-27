import { UserRepository } from '../repositories/user.repository';
import { User, UserInput } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
    static async register(data: UserInput): Promise<Omit<User, 'password_hash'>> {
        const password_hash = await bcrypt.hash(data.password, 10);

        const newUser = await UserRepository.create(data.username, data.email, password_hash);

        const { password_hash: _, ...safeUser } = newUser;

        return safeUser;
    }

    static async login(email: string, password: string): Promise<string> {
        const user = await UserRepository.getByEmail(email);
        if (!process.env.JWT_SECRET) {
            throw new Error('Configuration serveur manquante');
        }

        if (!user) {
            throw new Error('Wrong email or password');
        }
        if (!(await bcrypt.compare(password, user.password_hash))) {
            throw new Error('Wrong email or password');
        }
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '7d',
            },
        );
        return token;
    }
}
