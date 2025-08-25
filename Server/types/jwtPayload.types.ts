export interface JwtPayload {
  userId: number;
  role: string;
}

export interface refreshTokenPayload {
  userId: number;
}