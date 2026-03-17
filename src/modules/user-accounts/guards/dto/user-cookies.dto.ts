/**
 * user object for the jwt token and for transfer from the request object
 */
export class UserCookiesDto {
  id: string;
  deviceId: string;
  iat: number;
}

export type Nullable<T> = { [P in keyof T]: T[P] | null };
