import dotenv from "dotenv";
dotenv.config();

export const settings = {
    secretKey : process.env.ACCESSTOKENSECRET as string,
    port: process.env.PORT,
    environment: process.env.ENVIRONMENT
}
