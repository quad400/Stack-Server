import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EXPIRY,
  JWT_ACCESS_KEY,
  JWT_REFRESH_EXPIRY,
  JWT_REFRESH_KEY,
} from "../../constants/env";

type JwtSub = string | Record<string, any>;
export class JWTHelper {
  generateToken(sub: JwtSub) {
    return {
      access: this.generateAccessToken(sub),
      refresh: this.generateRefreshToken(sub),
    };
  }

  generateAccessToken(sub: JwtSub) {
    return jwt.sign(sub, JWT_ACCESS_KEY, {
      expiresIn: JWT_ACCESS_EXPIRY,
    });
  }

  generateRefreshToken(sub: JwtSub) {
    return jwt.sign(sub, JWT_REFRESH_KEY, {
      expiresIn: JWT_REFRESH_EXPIRY,
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_KEY);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_KEY);
  }
}
