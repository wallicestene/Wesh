import dotenv from "dotenv";
dotenv.config();

interface Config {
  port: number;
  dbUrl: string;
    frontendUrl: string;
  //   trustedOrigins: string[];
}

const config: Config = {
  port: parseInt(process.env.PORT as string) || 3000,
  dbUrl: process.env.DATABASE_URL || "",
  frontendUrl: process.env.FRONTEND_URL || "",
};

export default config;
