"use client";
import { Collapse, Typography, Divider, Button, Radio, Tabs } from "antd";
import { useAlertsCounter } from "@/app/store/alertsCunterStore";
import useUser from "@/app/store/userStore";
import { IAlertTypeWithId } from "@/app/types/IAlert";
import {
  fetchUserAlerts,
  updateAlertStatus,
} from "@/app/services/AlertsServices";
import { useEffect, useState } from "react";
import IConnectionRequest from "@/app/types/IConnectionRequest";
import { ObjectId } from "mongoose";
import { toast } from "react-toastify";
import {
  fetchUsersConnectionReq,
  updateConnections,
  updateRequestReadable,
  updateRequestStatus,
} from "@/app/services/ConnectionsServices";
import TabPane from "antd/es/tabs/TabPane";

const { Title } = Typography;

type ExtendedItemType = {
  key: string;
  title: string;
  label: React.ReactNode;
  children: React.ReactNode;
  readen: boolean;
  date: Date;
};

type ExtendedREquestType = {
  key: string;
  sender: ObjectId;
  status: string;
  sender_name: string;
  date: Date;
  label: React.ReactNode;
  children: React.ReactNode;
  readen: boolean;
};

const page = () => {
  const AlertsCounter: number = useAlertsCounter(
    (state) => state.alertsCounter
  );
  const decreaseAlertCounter = useAlertsCounter((state) => state.decrease);
  const user = useUser();
  const [alerts, setAlerts] = useState<ExtendedItemType[]>([]);
  const [requests, setRequests] = useState<ExtendedREquestType[]>([]);
  const [category, setCategory] = useState<string>("waiting"); // קטגוריה פעילה

  useEffect(() => {
    const fetchAlertsAndRequests = async () => {
      const fetchRequests = await getConnectionRequests();
      const fetchedAlerts = await getAlerts();

      setRequests(fetchRequests);
      setAlerts(fetchedAlerts);
    };

    fetchAlertsAndRequests();
  }, [user._id]);

  //זה אמו להיות בquery?
  const getAlerts = async () => {
    const returnAlerts: ExtendedItemType[] = [];
    try {
      const alerts: IAlertTypeWithId[] = await fetchUserAlerts(
        "674b74d0dc0ad6b3951e1671"
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
        })
      );
      return returnAlerts;
    } catch (error) {
      console.error("Failed to fetch alerts in getAlerts:", error);
      return []; // החזרת מערך ריק במקרה של שגיאה
    }
  };

  //זה אמור להיות בuery?
  const getConnectionRequests = async () => {
    const returnConnectionRequests: ExtendedREquestType[] = [];
    try {
      const connections: IConnectionRequest[] = await fetchUsersConnectionReq(
        "674b74d0dc0ad6b3951e1671"
      );


      connections.forEach((connectionReq: IConnectionRequest) => {
        const { labelContent, childrenContent } = getConnectionRequestChildren(
          connectionReq.status,
          connectionReq
        ); // שימוש בפונקציה לעזר

        returnConnectionRequests.push({
          key: String(connectionReq._id),
          sender: connectionReq.userIdSender,
          status: connectionReq.status,
          sender_name: connectionReq.sendersName,
          date: connectionReq.date,
          label: (
            <span
              style={{ fontWeight: connectionReq.readen ? "normal" : "bold" }}
            >
              {labelContent}
            </span>
          ),
          children: childrenContent,
          readen: connectionReq.readen,
        });
      });

      return returnConnectionRequests;
    } catch (error) {
      console.error("Failed to fetch connection requests:", error);
      return []; // החזרת מערך ריק במקרה של שגיאה
    }
  };

  const getConnectionRequestChildren = (
    status: string,
    connectionReq: IConnectionRequest
  ) => {
    let labelContent = "";
    let childrenContent = null;

    switch (status) {
      case "waiting":
        labelContent = `${connectionReq.sendersName} wants to connect to you`;
        childrenContent = (
          <div>
            <p>Would you want to connect?</p>
            <div className="flex justify-start gap-4 mt-4">
              <Button
                type="primary"
                onClick={async () => {
                  await accept(
                    String(connectionReq._id),
                    connectionReq.userIdSender.toString()
                  );
                }}
              >
                אשר
              </Button>
              <Button
                type="default"
                onClick={() => reject(String(connectionReq._id))}
              >
                דחה
              </Button>
            </div>
          </div>
        );
        break;
      case "rejected":
        labelContent = `You have rejected the connection request from ${connectionReq.sendersName}`;
        childrenContent = (
          <div>
            <p>
              You have rejected the connection request to user{" "}
              {connectionReq.sendersName}.
            </p>
            <p>Regret? Would you want to connect?</p>
            <Button
              className="flex justify-start gap-4 mt-4"
              type="primary"
              onClick={async () => {
                await accept(
                  String(connectionReq._id),
                  connectionReq.userIdSender.toString()
                );
              }}
            >
              אשר
            </Button>
          </div>
        );
        break;
      case "accepted":
        labelContent = `You have connected to user ${connectionReq.sendersName}`;
        childrenContent = (
          <div>
            <p>
              You have connected to user {connectionReq.sendersName},
              congratulations.
            </p>
          </div>
        );
        break;
      default:
        labelContent = "Unknown Status";
        break;
    }

    return { labelContent, childrenContent };
  };

  const handlePanelAlertsChange = async (key: string | string[]) => {
    if (Array.isArray(key)) {
      key = key[0];
    }

    if (typeof key !== "string") {
      return;
    }
    console.log("clicked");


    const updatedAlerts = alerts.map((alert) => {
      if (alert.key === key && !alert.readen) {
        decreaseAlertCounter();
        updateAlertStatus(key); // אין צורך ב-await כאן
        return { ...alert, readen: true, label: <span>{alert.title}</span> };
      }
      return alert;
    });
    setAlerts(updatedAlerts);

    
    // const updatedAlerts = await Promise.all(
    //   alerts.map(async (alert: ExtendedItemType) => {
    //     if (alert.key === key && !alert.readen) {
    //       console.log("clicked 2");

    //       decreaseAlertCounter();
    //       await updateAlertStatus(key); // מעדכן סטטוס בשרת
    //       return { ...alert, readen: true, label: <span>{alert.title}</span> };
    //     }
    //     return alert;
    //   })
    // );
    // setAlerts(updatedAlerts); // עדכון ה-state עם הסטטוס החדש
  };

  const handlePanelRequestsChange = async (key: string | string[]) => {
    if (Array.isArray(key)) {
      key = key[key.length - 1];
    }

    if (typeof key !== "string") {
      return;
    }
    console.log("clicked requests", requests);
    const updatedRequests = await Promise.all(
      requests.map(async (request: ExtendedREquestType) => {
        if (request.key === key && !request.readen) {
          console.log("clicked 2 request");
          await updateRequestReadable(key);
          return {
            ...request,
            readen: true,
            label: <span>{request.sender_name} wants to connect to you</span>,
          };
        }
        return request;
      })
    );
    setRequests(updatedRequests); // עדכון ה-state עם הסטטוס החדש
  };

  const accept = async (requestId: string, sender: string) => {
    console.log("accepted");
    try {
      await updateConnections(sender, "674b74d0dc0ad6b3951e1671");
      await updateRequestStatus(requestId, "accepted");

      // עדכון ה-state המקומי
      setRequests((prevRequests) =>
        prevRequests.map((request) => {
          if (request.key === requestId) {
            return {
              ...request,
              status: "accepted",
              label: (
                <span
                  style={{ fontWeight: request.readen ? "normal" : "bold" }}
                >
                  {`You have connected to user ${request.sender_name}`}
                </span>
              ),
              children: (
                <div>
                  <p>
                    You have connected to user {request.sender_name},
                    congratulations.
                  </p>
                </div>
              ),
            };
          }
          return request;
        })
      );

      console.log("Updated requests after accept");
    } catch (error) {
      console.error("Failed to update connection:", error);
      toast.error("Failed to accept the connection request.");
    }
  };

  const reject = async (requestId: string) => {
    console.log("rejected");
    try {
      await updateRequestStatus(requestId, "rejected");

      setRequests((prevRequests) =>
        prevRequests.map((request) => {
          if (request.key === requestId) {
            return {
              ...request,
              status: "rejected",
              label: `You have rejected the connection request from ${request.sender_name}`,
              children: (
                <div>
                  <p>
                    You have rejected the connection request to user{" "}
                    {request.sender_name}.
                  </p>
                  <p>Regret? Would you want to connect?</p>
                  <Button
                    className="flex justify-start gap-4 mt-4"
                    type="primary"
                    onClick={async () => {
                      await accept(
                        String(request.key),
                        request.sender.toString()
                      );
                    }}
                  >
                    אשר
                  </Button>
                </div>
              ),
            };
          }
          return request;
        })
      );
    } catch (error) {
      console.error("Failed to reject:", error);
      toast.error("Failed to reject the connection request.");
    }
  };

  const renderRequests = (status: string) =>
    requests.filter((request) => request.status === status);

  return (
    <div className=" mb-[10vh] paging">
      
      <div className=" p-6">
  
        <Title level={3} className="">
          ההתרעות שלך
        </Title>
        <p className="text-red-500">
          שלום {user.userName}, מחכות לך {AlertsCounter} הודעות שעדיין לא נקראו.
        </p>
      </div>

      <Divider className="m-0" />

      {/* התראות על מלאי */}
      <div className="p-6 h-[35vh]">
        <Title level={4} className="font-sans pb-2">
          התראות
        </Title>
        <div className="h-full overflow-y-auto">
          <Collapse
            accordion
            items={alerts.map(({ readen, ...rest }) => rest)}
            onChange={(key) => handlePanelAlertsChange(key)}
          />
        </div>
      </div>

      <Divider className="mb-0" />

      {/* בקשות התחברות */}
      <div className="p-6 h-[35vh]">
        <Title level={4} className="font-sans">
          בקשות התחברות
        </Title>

        <Tabs
          defaultActiveKey="waiting"
          items={[
            {
              key: "waiting",
              label: "ממתינות",
              children: (
                <div className="h-full overflow-y-auto">
                  <Collapse
                    items={renderRequests("waiting").map(({ readen, ...rest }) => rest)}
                    onChange={(key) => handlePanelRequestsChange(key)}
                  />
                </div>
              ),
            },
            {
              key: "accepted",
              label: "אושרו",
              children: (
                <div className="h-full overflow-y-auto">
                  <Collapse
                    items={renderRequests("accepted").map(({ readen, ...rest }) => rest)}
                    onChange={(key) => handlePanelRequestsChange(key)}
                  />
                </div>
              ),
            },
            {
              key: "rejected",
              label: "נדחו",
              children: (
                <div className="h-full overflow-y-auto">
                  <Collapse
                    items={renderRequests("rejected").map(({ readen, ...rest }) => rest)}
                    onChange={(key) => handlePanelRequestsChange(key)}
                  />
                </div>
              ),
            },
          ]}
        /> 
      </div>
    </div>
  );
};

export default page;
