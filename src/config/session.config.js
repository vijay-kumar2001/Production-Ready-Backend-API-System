// Feature config files (jwt, session) should NOT define values — they should consume validated config

import { config } from "./env.js";

export const SESSION_EXPIRES_IN = config.session.expiresIn;
