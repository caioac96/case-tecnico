import jwt, { SignOptions } from "jsonwebtoken";
import env from "../config/env";
import { User } from "../entities/user.entity";

export function generateAccessToken(user: User) {
    const options: SignOptions = {
        expiresIn: env.access_token_exp as any || "30m"
    };

    return jwt.sign(
        { sub: user.id, register: user.register },
        env.jwt_access_secret as string,
        options
    );
}

export function generateRefreshToken(user: User) {
    const options: SignOptions = {
        expiresIn: env.refresh_token_exp as any || "7d"
    };

    return jwt.sign(
        { sub: user.id },
        env.jwt_refresh_secret as string,
        options
    );
}