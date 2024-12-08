"use client";
import { Collapse, Divider, Button, Tabs } from "antd";
import { useAlertsCounter } from "@/app/store/alertsCounterStore";
import useUser from "@/app/store/userStore";
import { AlertTypeFotCollapse, IAlertTypeWithId } from "@/app/types/IAlert";
import {fetchUserAlerts, updateAlertStatus} from "@/app/services/AlertsServices";
import { useEffect, useState } from "react";
import IConnectionRequest, { RequestTypeFotCollapse } from "@/app/types/IConnectionRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {fetchUsersConnectionReq,updateConnections,updateRequestReadable,updateRequestStatus,} from "@/app/services/ConnectionsServices";


const Page = () => {
  const decreaseAlertCounter = useAlertsCounter((state) => state.decrease);
  const user = useUser();
  const [alerts, setAlerts] = useState<AlertTypeFotCollapse[]>([]);
  const [requests, setRequests] = useState<RequestTypeFotCollapse[]>([]);

  useEffect(() => {

    
    const fetchAlertsAndRequests = async () => {
      const fetchRequests = await getConnectionRequests();
      const fetchedAlerts = await getAlerts();

      setRequests(fetchRequests);
      setAlerts(fetchedAlerts);
    };
    fetchAlertsAndRequests();
  },[]); //user._id


  const getAlerts = async () => {
    console.log(user._id);
    const returnAlerts: AlertTypeFotCollapse[] = [];
    try {
      const alerts: IAlertTypeWithId[] = await fetchUserAlerts(
        "675007691ba3350d49f9b4e5"
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

  const getConnectionRequests = async () => {
    const returnConnectionRequests: RequestTypeFotCollapse[] = [];
    try {
      const connections: IConnectionRequest[] = await fetchUsersConnectionReq(
        "675007691ba3350d49f9b4e5"
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

  const handlePanelRequestsChange = async (key: string | string[]) => {
    if (Array.isArray(key)) {
      key = key[key.length - 1];
    }

    if (typeof key !== "string") {
      return;
    }

    const updatedRequests = await Promise.all(
      requests.map(async (request: RequestTypeFotCollapse) => {
        if (request.key === key && !request.readen) {
          await updateRequestReadable(key);
          decreaseAlertCounter();
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
      await updateConnections(sender, "675007691ba3350d49f9b4e5");
      await updateRequestStatus(requestId, "accepted");

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
    requests.filter((request) => request.status === status)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    <div className="mb-[10vh]">

      {/* התראות על מלאי */}
      <div className="p-6 pt-2 h-[40vh]">
        <p className="font-sans text-base pb-2 font-thin">
          התראות
        </p>
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
                        status: "true"
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
                        status: "true"
                      }))}
                      onChange={(key) => handlePanelAlertsChange(key)}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      <Divider className="mb-0" />

      {/* בקשות התחברות */}
      <div className="p-6 pt-2 h-[40vh]">
        <p className="font-sans text-base font-thin">
          בקשות התחברות
        </p>

        <div className="rtl-tabs h-full flex flex-col">
          <Tabs
            defaultActiveKey="waiting"
            className="h-full flex flex-col"
            items={[
              {
                key: "waiting",
                label: "ממתינות",
                children: (
                  <div className="tab-content">
                    <Collapse
                      items={renderRequests("waiting").map((request) => ({
                        ...request,
                        readen: "true",
                      }))}
                      onChange={(key) => handlePanelRequestsChange(key)}
                    />
                  </div>
                ),
              },
              {
                key: "accepted",
                label: "אושרו",
                children: (
                  <div className="tab-content">
                    <Collapse
                      items={renderRequests("accepted").map((request) => ({
                        ...request,
                        readen: "true",
                      }))}
                      onChange={(key) => handlePanelRequestsChange(key)}
                    />
                  </div>
                ),
              },
              {
                key: "rejected",
                label: "נדחו",
                children: (
                  <div className="tab-content">
                    <Collapse
                      items={renderRequests("rejected").map((request) => ({
                        ...request,
                        readen: "true",
                      }))}
                      onChange={(key) => handlePanelRequestsChange(key)}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
