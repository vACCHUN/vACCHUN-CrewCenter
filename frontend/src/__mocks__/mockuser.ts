import { User } from "../types/users";
import { VatsimUser } from "../types/users";
import { Visitor } from "../types/atco";
export const mockVatsimUser: VatsimUser = {
  cid: "1234567",
  personal: {
    name_first: "János",
    name_last: "Kiss",
    name_full: "Kiss János",
    email: "janos.kiss@example.com",
  },
  vatsim: {
    rating: {
      id: 5,
      long: "Senior Controller (C3)",
      short: "C3",
    },
    pilotrating: {
      id: 3,
      long: "Private Pilot (P1)",
      short: "P1",
    },
    division: {
      id: "HUN",
      name: "Hungary vACC",
    },
    region: {
      id: "EUR",
      name: "Europe",
    },
    subdivision: {
      id: "HUF",
      name: "Hungary FIR",
    },
  },
  oauth: {
    token_valid: true,
  },
};

export const mockVisitors: Visitor[] = [
  { cid: "11234143", initial: "AB" },
  { cid: "12314131", initial: "BC" },
];

export const mockUser: User = {
  CID: "1235513",
  name: "Horváth János",
  initial: "HO",
  isAdmin: 0,
  isInstructor: 0,
  trainee: 1,
};