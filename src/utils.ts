export const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)';

export type JWT_Payload = {
  id: number;

  username: string;

  email: string;

  isvalidate: boolean;

  createdAt: Date;

  updatedAt: Date;
};
