export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  salt: string;
  permissions: string[];
}
