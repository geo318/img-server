import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('8008'),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string().default('5432'),
  SECRET: z.string().length(64),
  UPSTASH_REDIS_URL: z.string(),
  UPSTASH_REDIS_TOKEN: z.string(),
})

const envVariables = envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default envVariables
