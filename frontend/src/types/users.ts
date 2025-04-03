export type VatsimUser = {
  cid: string;
  personal: {
    name_first: string;
    name_last: string;
    name_full: string;
    email: string;
  };
  vatsim: {
    rating: {
      id: number;
      long: string;
      short: string;
    };
    pilotrating: {
      id: number;
      long: string;
      short: string;
    };
    division: {
      id: string;
      name: string;
    };
    region: {
      id: string;
      name: string;
    };
    subdivision: {
      id: string;
      name: string;
    };
  };
  oauth: {
    token_valid: boolean;
  };
};


export type User = {
  CID: string;
  name: string;
  initial: string;
  isAdmin: boolean | number;
  isInstructor: boolean | number;
  trainee: boolean | number;
}