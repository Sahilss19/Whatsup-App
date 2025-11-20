import "dotenv/config";


export const ENV = {

    PORT: process.env.PORT || 3000,

    MONGODB_URL: process.env.MONGODB_URL,

    NODE_ENV: process.env.NODE_ENV

}