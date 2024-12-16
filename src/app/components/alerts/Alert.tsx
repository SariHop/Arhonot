// "use client"
import { fetchUserAlerts, updateAlertStatus } from "@/app/services/AlertsServices";
import { AlertProps, AlertTypeFotCollapse, IAlertTypeWithId } from "@/app/types/IAlert";
import { Collapse, Tabs } from "antd";
import React, { useEffect, useState } from "react";


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
            // "675007691ba3350d49f9b4e5"
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
          return []; // החזרת מערך ריק במקרה של שגיאה
        }
      };

      const handlePanelAlertsChange = async (key: string | string[]) => {
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
        defaultActiveKey="waiting"
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
