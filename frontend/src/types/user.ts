export type BaseUser = {
  email: string;
};

export type UserRecord =
  | (BaseUser & {
      id: string;
      name: string;
      emailVisibility: boolean;
      verified: boolean;
      created: Date;
      updated: Date;
      avatar?: string;
      role: UserRole;
    })
  | null;

export type NewUser = BaseUser & {
  password: string;
};

export type UserRole = 'admin' | 'devops' | 'developer';
