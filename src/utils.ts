export const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)';
export const CURRENT_USER_KEY = 'user';

export type JWT_Payload = {
  id: number;

  username: string;

  email: string;

  isvalidate: boolean;

  image: string | null;

  createdAt: Date;

  updatedAt: Date;
};
