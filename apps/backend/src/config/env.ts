import 'dotenv/config';

const required = (key: string) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment key: ${key}`);
    }
    return process.env[key];
};

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
    pg: {
        url: required('PG_URL')
    },
    jwt_access_secret: required("JWT_ACCESS_SECRET")!,
    access_token_exp: required("ACCESS_TOKEN_EXPIRES")!,
    jwt_refresh_secret: required("JWT_REFRESH_SECRET")!,
    refresh_token_exp: required("REFRESH_TOKEN_EXPIRES")!,
};

export default env;