//for jwt we need secret and not time for expiration(that can be given instantly in code)
// Feature config files (jwt, session) should NOT define values — they should consume validated config

import { config } from "./env.js";

export const JWT_ACCESS_SECRET = config.jwt.accessSecret;
export const JWT_REFRESH_SECRET = config.jwt.refreshSecret;
export const JWT_ACCESS_EXPIRES_IN = config.jwt.accessExpiresIn;
export const JWT_REFRESH_EXPIRES_IN = config.jwt.refreshExpiresIn;
