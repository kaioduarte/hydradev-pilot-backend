export interface ICreateUserDto {
  name: string;
  username: string;
  password: string;
  role?: 'basic' | 'admin';
}
