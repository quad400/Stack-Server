export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  avatar: string;
  activationCode: string | undefined;
  activationCodeExpire: Date | undefined;

  generateActivation: () => void;
}

export interface ICreateUser {
  email: string;
  fullName: string;
  password: string;
}

export interface IGetUser {
  _id: string;
}

export interface IGetUserBy<T = string, R = string> {
  field: T;
  value: R;
}

export interface IResetPass {
  password: string;
  confirmPassword: string;
}

export type IUpdateUser = IGetUser & Partial<ICreateUser>;

export type ILogin = Pick<ICreateUser, "email" | "password">;
