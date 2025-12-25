import { UserRepository } from '../repositories/user.repository';
import { User, UserInput } from '../models/user.model';
import bcrypt from 'bcrypt';

export class AuthService {
    static async register(data: UserInput): Promise<Omit<User, 'password_hash'>> {
        const password_hash = await bcrypt.hash(data.password, 10);

        const newUser = await UserRepository.create(data.username, data.email, password_hash);

        const { password_hash: _, ...safeUser } = newUser;

        return safeUser;
    }
}
