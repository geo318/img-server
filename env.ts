import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(8008),
  DB_PORT: z.coerce.number(),
})

const envVariables = envSchema.parse(Bun.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default envVariables
