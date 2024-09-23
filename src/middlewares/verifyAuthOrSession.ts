import { verifyToken } from "@clerk/backend";
import { NextFunction, Response } from "express";
import admin from "firebase-admin"; // Firebase Admin SDK

export const verifyTokenOrSession = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const sessionId = req.headers["x-session-id"];

  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Handle authenticated user
      const bearerToken = authHeader.replace("Bearer ", "");

      const verifiedToken = await verifyToken(bearerToken, {
        jwtKey: process.env.CLERK_JWT_KEY,
        authorizedParties: ["http://localhost:3000"],
      });

      const tokenPayload = {
        sub: (verifiedToken as any).sub,
        metadata: (verifiedToken as any).metadata || { role: "guest" },
        sid: (verifiedToken as any).sid,
      };

      const {
        sub: userId,
        metadata: { role },
        sid: tokenSessionId,
      } = tokenPayload;

      req.user = { userId, roles: [role], sessionId: tokenSessionId };
      next();
    } else if (sessionId) {
      const sessionDoc = await admin
        .firestore()
        .collection("sessions")
        .doc(sessionId)
        .get();

      if (sessionDoc.exists) {
        req.user = { sessionId, roles: ["anonymous"] };
        next();
      } else {
        return res.status(401).json({ error: "Invalid session ID" });
      }
    } else {
      // If neither token nor session ID is provided
      return res.status(401).json({
        error: "Authorization header or session ID missing or invalid",
      });
    }
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
