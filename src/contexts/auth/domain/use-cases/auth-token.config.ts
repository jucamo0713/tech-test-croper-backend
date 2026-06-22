export interface AuthTokenConfig {
  sessionSecret: string;
  sessionExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
}
