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
    }
};

export default env;