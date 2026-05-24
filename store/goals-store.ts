import { create } from "zustand"
import { goals, type Goal } from "@/lib/mock-data"

type GoalsState = {
  goals: Goal[]
  addGoal: (goal: Goal) => void
  addFunds: (id: string, amount: number) => void
}

export const useGoalsStore = create<GoalsState>((set) => ({
  goals,

  addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),

  addFunds: (id, amount) =>
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === id ? { ...g, current: Math.min(g.current + amount, g.target) } : g
      ),
    })),
}))
