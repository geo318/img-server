import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('8008'),
  DB_PORT: z.string(),
})

const envVariables = envSchema.parse(Bun.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default envVariables
