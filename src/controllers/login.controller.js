import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { loginRepository } from "../repositories/login.repository.js";
dotenv.config();

export async function signUp(req, res) {
    const { user } = res.locals;
    try {
        await insertUser(user);
        return res.status(201).
            send('Usuário cadastrado');
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function signIn(req, res) {
    const { user } = res.locals;
    try {
        if (!user.token) {
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.SECRET_JWT,
                { expiresIn: 60 * 60 * 24 * 30 }
            );
            await
                loginRepository.updateUserToken(user, token);
            return res.status(200).send({token});
        }
        return res.status(200).send({token:user.token});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}