export const config = () => ({
  SERVER_PORT: 3000,

  REDIS_URI: "redis://:password**@host:port/db",

  MYSQL: {
    HOST: "host",
    PORT: "port",
    USERNAME: "username",
    PASSWORD: "password",
    DATABASE: "database",
  },

  CACHE: {
    TTL: 2000,
    MAX: 100,
  },

  THROTTLER: {
    TTL: 1,
    LIMIT: 100,
  },

  JWT_SECRET_KEY: "jwt_secret_ket",
});
