import type { Attendance, Parche, Plan, User, Vote } from "../types";
import { seedAttendance, seedParches, seedPlans, seedUsers, seedVotes } from "../data/seed";

export type AppData = {
  users: User[];
  parches: Parche[];
  plans: Plan[];
  votes: Vote[];
  attendance: Attendance[];
  currentUserId: number | null;
};

const APP_KEY = "parcheplan_u_data";

export function getInitialAppData(): AppData {
  const dataText = localStorage.getItem(APP_KEY);

  if (!dataText) {
    const initialData: AppData = {
      users: seedUsers,
      parches: seedParches,
      plans: seedPlans,
      votes: seedVotes,
      attendance: seedAttendance,
      currentUserId: null,
    };

    localStorage.setItem(APP_KEY, JSON.stringify(initialData));
    return initialData;
  }

  return JSON.parse(dataText) as AppData;
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(APP_KEY, JSON.stringify(data));
}
