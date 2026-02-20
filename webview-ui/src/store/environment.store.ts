import { create } from "zustand";

interface Environment {
  id: string;
  name: string;
}

interface EnvironmentState {
  environments: Environment[];
  activeId: string | null;
  setEnvironments: (environments: Environment[]) => void;
  setActiveId: (id: string) => void;
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  environments: [],
  activeId: null,
  setEnvironments: (environments) => set({ environments }),
  setActiveId: (id) => set({ activeId: id }),
}));
