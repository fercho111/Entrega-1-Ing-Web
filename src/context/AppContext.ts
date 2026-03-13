import { createContext } from "react";
import {
  AttendanceStatusEnum,
  ParcheRoleEnum,
  type Attendance,
  type Parche,
  type Plan,
  type User,
  type Vote,
} from "../types";

type RegisterData = {
  fullName: string;
  email: string;
  major: string;
  password: string;
  avatarUrl?: string;
};

type NewParcheData = {
  name: string;
  description: string;
  coverImageUrl: string;
};

type NewPlanData = {
  parcheId: number;
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  votingDeadline: string;
  options: { place: string; time: string }[];
};

export type AppContextType = {
  users: User[];
  parches: Parche[];
  plans: Plan[];
  votes: Vote[];
  attendance: Attendance[];
  currentUser: User | null;
  register: (data: RegisterData) => { success: boolean; message: string };
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  createParche: (data: NewParcheData) => void;
  joinParche: (inviteCode: string) => { success: boolean; message: string };
  updateRole: (parcheId: number, targetUserId: number, role: ParcheRoleEnum) => void;
  createPlan: (data: NewPlanData) => { success: boolean; message: string };
  movePlanState: (planId: number) => void;
  voteForOption: (planId: number, optionId: number) => void;
  closeVotingIfTimePassed: () => void;
  setAttendance: (planId: number, status: AttendanceStatusEnum) => void;
  setCheckIn: (planId: number) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);
