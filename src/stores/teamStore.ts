import { create } from "zustand";
import type { Team } from "@/types/team";

interface TeamState {
  teams: Team[];
  selectedTeamId: string | null;
  setTeams: (teams: Team[]) => void;
  selectTeam: (teamId: string | null) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  selectedTeamId: null,
  setTeams: (teams) => set({ teams }),
  selectTeam: (teamId) => set({ selectedTeamId: teamId })
}));
