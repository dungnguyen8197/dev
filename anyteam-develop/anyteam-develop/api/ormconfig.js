require('dotenv').config();
const env = process.env;

export default {
  "type": env.TYPEORM_CONNECTION,
  "host": env.TYPEORM_HOST,
  "port": env.TYPEORM_PORT,
  "username": env.TYPEORM_USERNAME,
  "password": env.TYPEORM_PASSWORD,
  "database": env.TYPEORM_DATABASE,
  "synchronize": env.TYPEORM_SYNCHRONIZE,
  "logging": env.TYPEORM_LOGGING,
  "entities": [env.TYPEORM_ENTITIES],
  "migrations": [env.TYPEORM_MIGRATIONS],
  "seeds": [env.TYPEORM_SEEDING_SEEDS],
  "factories": [env.TYPEORM_SEEDING_FACTORIES],
  "cli": {
    "entitiesDir": env.TYPEORM_ENTITIES_DIR,
    "migrationsDir": env.TYPEORM_MIGRATIONS_DIR,
    "subscribersDir": env.TYPEORM_SUBSCRIBERS_DIR
  }
}