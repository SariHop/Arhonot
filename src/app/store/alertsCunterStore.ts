import { create } from 'zustand'

type AlertsCounterStore = {
    alertsCounter: number
    increase: () => void
    decrease: () => void
}

export const useAlertsCounter = create<AlertsCounterStore>()((set) => ({
  alertsCounter: 0,
  increase: () => set((state) => ({ alertsCounter: state.alertsCounter + 1 })),
  decrease: () => set((state) => ({ alertsCounter: state.alertsCounter - 1 })),
}));