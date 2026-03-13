import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getInitialAppData, saveAppData } from "../services/localStorage";
import {
  AttendanceStatusEnum,
  ParcheRoleEnum,
  PlanStateEnum,
  type Attendance,
  type Parche,
  type Plan,
  type User,
  type Vote,
} from "../types";

import { AppContext, type AppContextType } from "./AppContext";

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

export function AppProvider({ children }: { children: ReactNode }) {
  const initialData = getInitialAppData();

  const [users, setUsers] = useState<User[]>(initialData.users);
  const [parches, setParches] = useState<Parche[]>(initialData.parches);
  const [plans, setPlans] = useState<Plan[]>(initialData.plans);
  const [votes, setVotes] = useState<Vote[]>(initialData.votes);
  const [attendance, setAttendanceState] = useState<Attendance[]>(initialData.attendance);
  const [currentUserId, setCurrentUserId] = useState<number | null>(initialData.currentUserId);

  useEffect(() => {
    if (users.length === 0) {
      return;
    }

    saveAppData({ users, parches, plans, votes, attendance, currentUserId });
  }, [users, parches, plans, votes, attendance, currentUserId]);

  const currentUser = useMemo(() => {
    return users.find((user) => user.id === currentUserId) ?? null;
  }, [users, currentUserId]);

  function register(data: RegisterData) {
    const userAlreadyExists = users.some((user) => user.email.toLowerCase() === data.email.toLowerCase());
    if (userAlreadyExists) {
      return { success: false, message: "Email already registered" };
    }

    const newUser: User = {
      id: users.length + 1,
      fullName: data.fullName,
      email: data.email,
      major: data.major,
      password: data.password,
      avatarUrl: data.avatarUrl,
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);
    setCurrentUserId(newUser.id);
    return { success: true, message: "Account created" };
  }

  function login(email: string, password: string) {
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    setCurrentUserId(user.id);
    return { success: true, message: "Welcome back" };
  }

  function logout() {
    setCurrentUserId(null);
  }

  function createParche(data: NewParcheData) {
    if (!currentUser) {
      return;
    }

    const newParche: Parche = {
      id: parches.length + 1,
      name: data.name,
      description: data.description,
      coverImageUrl: data.coverImageUrl,
      inviteCode: `${data.name.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      members: [{ userId: currentUser.id, role: ParcheRoleEnum.owner }],
    };

    setParches((previousParches) => [...previousParches, newParche]);
  }

  function joinParche(inviteCode: string) {
    if (!currentUser) {
      return { success: false, message: "You must be logged in" };
    }

    const parcheToJoin = parches.find((parche) => parche.inviteCode.toLowerCase() === inviteCode.toLowerCase());

    if (!parcheToJoin) {
      return { success: false, message: "Invite code not found" };
    }

    const userAlreadyInParche = parcheToJoin.members.some((member) => member.userId === currentUser.id);
    if (userAlreadyInParche) {
      return { success: false, message: "You are already in this parche" };
    }

    const updatedParches = parches.map((parche) => {
      if (parche.id !== parcheToJoin.id) {
        return parche;
      }

      return {
        ...parche,
        members: [...parche.members, { userId: currentUser.id, role: ParcheRoleEnum.member }],
      };
    });

    setParches(updatedParches);
    return { success: true, message: "Joined successfully" };
  }

  function updateRole(parcheId: number, targetUserId: number, role: ParcheRoleEnum) {
    if (!currentUser) {
      return;
    }

    setParches((previousParches) => {
      return previousParches.map((parche) => {
        if (parche.id !== parcheId) {
          return parche;
        }

        const currentMember = parche.members.find((member) => member.userId === currentUser.id);
        const isOwner = currentMember?.role === ParcheRoleEnum.owner;

        if (!isOwner) {
          return parche;
        }

        const updatedMembers = parche.members.map((member) => {
          if (member.userId !== targetUserId) {
            return member;
          }

          return { ...member, role };
        });

        return { ...parche, members: updatedMembers };
      });
    });
  }

  function createPlan(data: NewPlanData) {
    if (!currentUser) {
      return { success: false, message: "You must be logged in" };
    }

    if (data.options.length < 3) {
      return { success: false, message: "Plan needs at least 3 options" };
    }

    const newPlanId = plans.length + 1;
    const newPlan: Plan = {
      id: newPlanId,
      parcheId: data.parcheId,
      createdBy: currentUser.id,
      title: data.title,
      description: data.description,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      votingDeadline: data.votingDeadline,
      state: PlanStateEnum.draft,
      options: data.options.map((option, index) => ({
        id: newPlanId * 10 + index + 1,
        place: option.place,
        time: option.time,
      })),
      checkInStart: `${data.dateStart}T18:00`,
      checkInEnd: `${data.dateStart}T23:00`,
    };

    setPlans((previousPlans) => [...previousPlans, newPlan]);
    return { success: true, message: "Plan created" };
  }

  function movePlanState(planId: number) {
    if (!currentUser) {
      return;
    }

    setPlans((previousPlans) => {
      return previousPlans.map((plan) => {
        if (plan.id !== planId) {
          return plan;
        }

        const parche = parches.find((item) => item.id === plan.parcheId);
        const currentMember = parche?.members.find((member) => member.userId === currentUser.id);
        const canMoveState =
          currentMember?.role === ParcheRoleEnum.owner || currentMember?.role === ParcheRoleEnum.moderator;

        if (!canMoveState) {
          return plan;
        }

        if (plan.state === PlanStateEnum.draft) {
          return { ...plan, state: PlanStateEnum.votingOpen };
        }

        if (plan.state === PlanStateEnum.votingOpen) {
          return applyCloseVoting(plan);
        }

        if (plan.state === PlanStateEnum.votingClosed) {
          return { ...plan, state: PlanStateEnum.scheduled };
        }

        return plan;
      });
    });
  }

  const applyCloseVoting = useCallback((plan: Plan) => {
    const planVotes = votes.filter((vote) => vote.planId === plan.id);

    let winningOptionId = plan.options[0]?.id;
    let highestVotes = -1;

    for (const option of plan.options) {
      const optionVotes = planVotes.filter((vote) => vote.optionId === option.id).length;
      if (optionVotes > highestVotes) {
        highestVotes = optionVotes;
        winningOptionId = option.id;
      }
    }

    return {
      ...plan,
      state: PlanStateEnum.votingClosed,
      winningOptionId,
    };
  }, [votes]);


  function voteForOption(planId: number, optionId: number) {
    if (!currentUser) {
      return;
    }

    setVotes((previousVotes) => {
      const existingVote = previousVotes.find((vote) => vote.planId === planId && vote.userId === currentUser.id);

      if (!existingVote) {
        return [...previousVotes, { planId, userId: currentUser.id, optionId }];
      }

      return previousVotes.map((vote) => {
        if (vote.planId === planId && vote.userId === currentUser.id) {
          return { ...vote, optionId };
        }
        return vote;
      });
    });
  }

  const closeVotingIfTimePassed = useCallback(() => {
    setPlans((previousPlans) => {
      let hasChanges = false;

      const nextPlans = previousPlans.map((plan) => {
        if (plan.state !== PlanStateEnum.votingOpen) {
          return plan;
        }

        const now = new Date();
        const deadline = new Date(plan.votingDeadline);

        if (now < deadline) {
          return plan;
        }

        hasChanges = true;
        return applyCloseVoting(plan);
      });

      return hasChanges ? nextPlans : previousPlans;
    });
  }, [applyCloseVoting]);

  function setAttendance(planId: number, status: AttendanceStatusEnum) {
    if (!currentUser) {
      return;
    }

    setAttendanceState((previousAttendance) => {
      const existingAttendance = previousAttendance.find((item) => item.planId === planId && item.userId === currentUser.id);

      if (!existingAttendance) {
        return [...previousAttendance, { planId, userId: currentUser.id, status, checkedIn: false }];
      }

      return previousAttendance.map((item) => {
        if (item.planId === planId && item.userId === currentUser.id) {
          return { ...item, status };
        }
        return item;
      });
    });
  }

  function setCheckIn(planId: number) {
    if (!currentUser) {
      return;
    }

    setAttendanceState((previousAttendance) => {
      const existingAttendance = previousAttendance.find((item) => item.planId === planId && item.userId === currentUser.id);

      if (!existingAttendance) {
        return [...previousAttendance, { planId, userId: currentUser.id, status: AttendanceStatusEnum.yes, checkedIn: true }];
      }

      return previousAttendance.map((item) => {
        if (item.planId === planId && item.userId === currentUser.id) {
          return { ...item, checkedIn: true };
        }
        return item;
      });
    });
  }


  const value: AppContextType = {
    users,
    parches,
    plans,
    votes,
    attendance,
    currentUser,
    register,
    login,
    logout,
    createParche,
    joinParche,
    updateRole,
    createPlan,
    movePlanState,
    voteForOption,
    closeVotingIfTimePassed,
    setAttendance,
    setCheckIn,
  };

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
}