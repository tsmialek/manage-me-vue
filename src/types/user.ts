export type BaseUser = {
  email: string;
  name: string;
  avatar?: string;
};

export type UserRecord = BaseUser & {
  id: string;
  emailVisibility: boolean;
  verified: boolean;
  created: Date;
  updated: Date;
};

export type NewUser = BaseUser & {
  password: string;
  confirmPassword: string;
};
