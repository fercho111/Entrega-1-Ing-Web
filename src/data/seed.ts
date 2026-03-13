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

export const seedUsers: User[] = [
  { id: 1, fullName: 'Fernando Gómez', email: 'fer@uni.edu', major: 'Física', password: '1234' },
  { id: 2, fullName: 'Mateo Ruiz', email: 'mateo@uni.edu', major: 'Ingeniería Civil', avatarUrl: 'https://i.pravatar.cc/80?img=12', password: '1234' },
  { id: 3, fullName: 'Sara López', email: 'sara@uni.edu', major: 'Ingeniería Administrativa', avatarUrl: 'https://i.pravatar.cc/80?img=32', password: '1234' },
  { id: 4, fullName: 'Daniel Pardo', email: 'daniel@uni.edu', major: 'Medicina', password: '1234' },
  { id: 5, fullName: 'Camila Ríos', email: 'camila@uni.edu', major: 'Ingeniería de Sistemas', password: '1234' },
  { id: 6, fullName: 'Nicolás Mejía', email: 'nico@uni.edu', major: 'Ingeniería de Sistemas', password: '1234' },
  { id: 7, fullName: 'Valentina Pérez', email: 'vale@uni.edu', major: 'Ingeniería Mecánica', password: '1234' },
  { id: 8, fullName: 'Felipe Ortiz', email: 'felipe@uni.edu', major: 'Economía', password: '1234' },
  { id: 9, fullName: 'Juliana Castro', email: 'juli@uni.edu', major: 'Ingeniería Biotecnológica', avatarUrl: 'https://i.pravatar.cc/80?img=5', password: '1234' },
  { id: 10, fullName: 'Andrés Quintero', email: 'andres@uni.edu', major: 'Ingeniería Mecatrónica', password: '1234' }
];

export const seedParches: Parche[] = [
  {
    id: 1,
    name: "Parche Campus Norte",
    description: "Grupo para salir después de clase en la sede norte.",
    coverImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
    inviteCode: "NORTE-123",
    members: [
      { userId: 1, role: ParcheRoleEnum.owner },
      { userId: 2, role: ParcheRoleEnum.moderator },
      { userId: 3, role: ParcheRoleEnum.member },
      { userId: 4, role: ParcheRoleEnum.member },
      { userId: 5, role: ParcheRoleEnum.member },
      { userId: 6, role: ParcheRoleEnum.member },
    ],
  },
  {
    id: 2,
    name: "Parche Viernes Chill",
    description: "Planear salidas tranquilas para los viernes.",
    coverImageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
    inviteCode: "CHILL-456",
    members: [
      { userId: 7, role: ParcheRoleEnum.owner },
      { userId: 8, role: ParcheRoleEnum.moderator },
      { userId: 9, role: ParcheRoleEnum.member },
      { userId: 10, role: ParcheRoleEnum.member },
      { userId: 1, role: ParcheRoleEnum.member },
      { userId: 3, role: ParcheRoleEnum.member },
    ],
  },
];

export const seedPlans: Plan[] = Array.from({ length: 15 }, (_, index) => {
  const planId = index + 1;
  const isFirstParche = planId <= 8;
  const parcheId = isFirstParche ? 1 : 2;
  const createdBy = isFirstParche ? 1 : 7;

  return {
    id: planId,
    parcheId,
    createdBy,
    title: `Plan #${planId}`,
    description: `Descripción simple del plan ${planId}.`,
    dateStart: "2026-03-10",
    dateEnd: "2026-03-20",
    state: planId % 4 === 0 ? PlanStateEnum.scheduled : PlanStateEnum.votingOpen,
    options: [
      { id: planId * 10 + 1, place: "Café Central", time: "18:00" },
      { id: planId * 10 + 2, place: "Parque Verde", time: "19:00" },
      { id: planId * 10 + 3, place: "Plazoleta", time: "20:00" },
    ],
    winningOptionId: planId % 4 === 0 ? planId * 10 + 1 : undefined,
    votingDeadline: "2099-12-31T23:59",
    checkInStart: "2026-03-15T18:00",
    checkInEnd: "2026-03-15T21:00",
  };
});

export const seedVotes: Vote[] = Array.from({ length: 30 }, (_, index) => {
  const plan = seedPlans[index % seedPlans.length];
  const userId = (index % 10) + 1;
  const option = plan.options[index % 3];
  return { planId: plan.id, userId, optionId: option.id };
});

export const seedAttendance: Attendance[] = seedPlans.flatMap((plan) => {
  const parche = seedParches.find((p) => p.id === plan.parcheId);

  if (!parche) return [];

  return parche.members.map((member, memberIndex) => {
    const statusIndex = (plan.id + member.userId + memberIndex) % 3;

    const status =
      statusIndex === 0
        ? AttendanceStatusEnum.yes
        : statusIndex === 1
          ? AttendanceStatusEnum.no
          : AttendanceStatusEnum.maybe;

    return {
      planId: plan.id,
      userId: member.userId,
      status,
      checkedIn: status === AttendanceStatusEnum.yes && (plan.id + member.userId) % 4 === 0,
    };
  });
});
