export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface AuthResult {
  accessToken: string;
  user: User;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterInput extends Credentials {
  name?: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string | null;
  password?: string;
}
