// src/types/tokenPayload.ts
export interface TokenPayload {
  sub: string;
  metadata: {
    role: string;
  };
  sid: string;
  nbf: string;
  azp: string;
  exp: string;
  iat: string;
  iss: string;
  jti: string;
}
