import { JwtPayload } from "./jwt.types.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}
