/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
    PORT: Env.schema.number(),
    HOST: Env.schema.string({ format: 'host' }),

    NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
    APP_KEY: Env.schema.string(),
    APP_NAME: Env.schema.string(),
    APP_URL: Env.schema.string(),

    DRIVE_DISK: Env.schema.enum(['local'] as const),

    SMTP_HOST: Env.schema.string({ format: 'host' }),
    SMTP_PORT: Env.schema.number(),
    SMTP_USERNAME: Env.schema.string(),
    SMTP_PASSWORD: Env.schema.string(),

    DB_CONNECTION: Env.schema.string(),

    CACHE_VIEWS: Env.schema.boolean(),

    PG_HOST: Env.schema.string({ format: 'host' }),
    PG_PORT: Env.schema.number(),
    PG_USER: Env.schema.string(),
    PG_PASSWORD: Env.schema.string.optional(),
    PG_DB_NAME: Env.schema.string(),

    // MYSQL_HOST: Env.schema.string({ format: 'host' }),
    // MYSQL_PORT: Env.schema.number(),
    // MYSQL_USER: Env.schema.string(),
    // MYSQL_PASSWORD: Env.schema.string.optional(),
    // MYSQL_DB_NAME: Env.schema.string(),
})
