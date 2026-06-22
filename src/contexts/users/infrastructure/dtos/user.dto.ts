export interface UserDto {
  userId: string;
  email: string;
  passwordHash: string;
  status?: string;
}
