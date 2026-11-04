export type AuthenticatedUser = {
  userId: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      auth?: AuthenticatedUser;
    }
  }
}

export {};
