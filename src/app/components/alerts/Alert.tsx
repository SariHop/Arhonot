// "use client"
import { fetchUserAlerts, updateAlertStatus } from "@/app/services/AlertsServices";
import { AlertProps, AlertTypeFotCollapse, IAlertTypeWithId } from "@/app/types/IAlert";
import { Collapse, Tabs } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


const Alert: React.FC<AlertProps> = ({userId, decreaseAlertCounter}) => {
    const [alerts, setAlerts] = useState<AlertTypeFotCollapse[]>([]);

    useEffect(() => {
        const fetchAlertsAndRequests = async () => {
          const fetchedAlerts = await getAlerts();
          setAlerts(fetchedAlerts);
        };

        fetchAlertsAndRequests();
      },[userId]); 

      

      const getAlerts = async () => {
        console.log(userId);
        const returnAlerts: AlertTypeFotCollapse[] = [];
        try {
          const alerts: IAlertTypeWithId[] = await fetchUserAlerts(
            userId
          );
    
          alerts.map((alert: IAlertTypeWithId) =>
            returnAlerts.push({
              key: alert._id,
              title: alert.title,
              label: (
                <span style={{ fontWeight: alert.readen ? "normal" : "bold" }}>
                  {alert.title}
                </span>
              ),
              children: <p>{alert.desc}</p>,
              readen: alert.readen,
              date: alert.date,
              status: alert.readen,
            })
          );
          return returnAlerts;
        } catch (error) {
          console.error("Failed to fetch alerts in getAlerts:", error);
          if (axios.isAxiosError(error)) {
            const serverError = error.response?.data?.error || "Unknown server error";
            const status = error.response?.status || 500;
      
            // מציג הודעה מפורטת למשתמש
            if (status === 400) {
              toast.error("שגיאה בקבלת נתונים, נסה שוב.");
            } else {
              toast.error(`שגיאת שרת: ${serverError}`);
            }
          } else {
            toast.error("שגיאה בטעינת התראות משתמש");
          }
          return []; // החזרת מערך ריק במקרה של שגיאה
        }
      };

      const handlePanelAlertsChange = async (key: string | string[]) => {
        try{
          if (Array.isArray(key)) {
            key = key[key.length - 1];
          }
          if (typeof key !== "string") {
            return;
          }
      
          const updatedAlerts = alerts.map((alert) => {
            if (alert.key === key && !alert.readen) {
              decreaseAlertCounter();
              updateAlertStatus(key); 
              return { ...alert, readen: true, label: <span>{alert.title}</span> };
            }
            return alert;
          });
          setAlerts(updatedAlerts);
      }catch(error){
        console.error(
          "Error fetching alerts:",
          error || "Invalid response format"
        );
        if (axios.isAxiosError(error)) {
          const serverError = error.response?.data?.error || "אירעה שגיאה בלתי צפויה";
          toast.error(`שגיאת שרת: ${serverError}`);
        } else {
          toast.error(" אירעה שגיאה בלתי צפויה בעדכון התראה" );
        }
        toast.error("שגיאה בעדכון התראה");
      }
      };

      const renderAlerts = (status: boolean) =>
        alerts
          .filter((alert) => alert.status === status)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          
          const handleTabChange = () => {
            setAlerts((prevAlerts) =>
              prevAlerts.map((alert) =>
                !alert.readen ? alert : { ...alert, status: true }
              )
            );
        };
      
  return (
    <div className="rtl-tabs h-full flex flex-col">
      <Tabs
        onChange={handleTabChange}
        defaultActiveKey="pending"
        className="h-full flex flex-col"
        items={[
          {
            key: "unreaden",
            label: "טרם נקראו",
            children: (
              <div className="tab-content">
                <Collapse
                  items={renderAlerts(false).map((alert) => ({
                    ...alert,
                    readen: "true",
                    status: "true",
                  }))}
                  onChange={(key) => handlePanelAlertsChange(key)}
                />
              </div>
            ),
          },
          {
            key: "readen",
            label: "הודעות שנקראו",
            children: (
              <div className="tab-content">
                <Collapse
                  items={renderAlerts(true).map((alert) => ({
                    ...alert,
                    readen: "true",
                    status: "true",
                  }))}
                  onChange={(key) => handlePanelAlertsChange(key)}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Alert;
