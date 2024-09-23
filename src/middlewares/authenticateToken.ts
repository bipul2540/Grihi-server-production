import { verifyToken } from "@clerk/backend";
import { NextFunction, Response } from "express";

export const authenticateToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.replace("Bearer ", "");

    try {
      const verifiedToken = await verifyToken(bearerToken, {
        jwtKey: process.env.CLERK_JWT_KEY,
        authorizedParties: [
          "http://localhost:3000",
          "https://c0b5-2409-40e4-5b-1ddf-2897-673c-832c-4403.ngrok-free.app",
          "https://4hpq66f4-3000.inc1.devtunnels.ms/",
        ],
      });

      const tokenPayload = {
        sub: (verifiedToken as any).sub,
        metadata: (verifiedToken as any).metadata || { role: "guest" },
        sid: (verifiedToken as any).sid,
      };

      const {
        sub: userId,
        metadata: { role },
        sid: sessionId,
      } = tokenPayload;
      req.user = { userId: userId ? userId : null, roles: [role], sessionId };
      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    return res
      .status(401)
      .json({ error: "Authorization header missing or invalid" });
  }
};
