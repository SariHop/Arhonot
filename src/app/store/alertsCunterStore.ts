import { create } from 'zustand'
import useUser from './userStore'


type AlertsCounterStore = {
    alertsCounter: number
    setAlertsCounter: (count: number) => void
    increase: () => void
    decrease: () => void
}

export const useAlertsCounter = create<AlertsCounterStore>()((set) => ({
  alertsCounter: 0,
  setAlertsCounter: (count: number) => set({ alertsCounter: count }),
  increase: () => set((state) => ({ alertsCounter: state.alertsCounter + 1 })),
  decrease: () => set((state) => ({ alertsCounter: state.alertsCounter - 1 })),
}));





