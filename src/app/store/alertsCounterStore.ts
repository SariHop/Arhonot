import { create } from 'zustand';
import { fetchUsersConnectionReq } from '../services/ConnectionsServices';
import { fetchUserAlerts } from '../services/AlertsServices';
import { Types } from 'mongoose';

type AlertsCounterStore = {
  alertsCounter: number;
  setAlertsCounter: (count: number) => void;
  increase: () => void;
  decrease: () => void;
};

export const useAlertsCounter = create<AlertsCounterStore>((set) => ({
  alertsCounter: 0,
  setAlertsCounter: (count: number) => set({ alertsCounter: count }),
  increase: () => set((state) => ({ alertsCounter: state.alertsCounter + 1 })),
  decrease: () => set((state) => ({ alertsCounter: state.alertsCounter - 1 })),
}));

export const initialize = async (userId: Types.ObjectId | null) => {
  try {
    const requests = await fetchUsersConnectionReq(userId);
    const alerts = await fetchUserAlerts(userId);

    let unreadCount = requests.filter((request: { readen: boolean }) => !request.readen).length;
    unreadCount += alerts.filter((alert: { readen: boolean }) => !alert.readen).length;

    // שימוש ב-setAlertsCounter מהממשק של Zustand
    useAlertsCounter.getState().setAlertsCounter(unreadCount);

  } catch (error) {
    console.error(
      "Error fetching alerts:",
      error || "Invalid response format"
    );
    useAlertsCounter.getState().setAlertsCounter(0); // ברירת מחדל במקרה של שגיאה
  }
};
