import {
  fetchUsersConnectionReq,
  updateConnections,
  updateRequestReadable,
  updateRequestStatus,
} from "@/app/services/ConnectionsServices";
import { AlertProps } from "@/app/types/IAlert";
import IConnectionRequest, {
  RequestTypeFotCollapse,
} from "@/app/types/IConnectionRequest";
import { Button, Collapse, Tabs } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ConnectionReq: React.FC<AlertProps> = ({
  userId,
  decreaseAlertCounter,
}) => {
  const [requests, setRequests] = useState<RequestTypeFotCollapse[]>([]);

  useEffect(() => {
    const fetchAlertsAndRequests = async () => {
      const fetchRequests = await getConnectionRequests();
      setRequests(fetchRequests);
    };
    fetchAlertsAndRequests();
  }, [userId]);

  const getConnectionRequests = async () => {
    const returnConnectionRequests: RequestTypeFotCollapse[] = [];
    try {
      const connections: IConnectionRequest[] = await fetchUsersConnectionReq(
        userId
      );

      connections.forEach((connectionReq: IConnectionRequest) => {
        const { labelContent, childrenContent } = getHTMLContentOfTheRequest(
          connectionReq.status,
          connectionReq
        );

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
      if (axios.isAxiosError(error)) {
        const serverError =
          error.response?.data?.error || "Unknown server error";
        const status = error.response?.status || 501;

        if (status === 400) {
          toast.error("שגיאה בקבלת נתונים בשרת.");
        } else if (status === 500) {
          toast.error(`שגיאת שרת: ${serverError}`);
        } else {
          toast.error("אירעה שגיאה לא צפויה בשרת");
        }
      } else {
        toast.error(" אירעה שגיאה לא צפויה בעת קבלת בקשות החיבור");
      }
      return []; // החזרת מערך ריק במקרה של שגיאה
    }
  };

  const getHTMLContentOfTheRequest = (
    status: string,
    connectionReq: IConnectionRequest
  ) => {
    let labelContent = "";
    let childrenContent = null;

    switch (status) {
      case "pending":
        labelContent = `${connectionReq.sendersName} רוצה להתחבר אלייך`;
        childrenContent = (
          <div>
            <p>רוצה לאשר את ההתחברות?</p>
            <div className="flex justify-start gap-4 mt-4">
              <Button
                type="primary"
                onClick={async () => {
                  await acceptRequest(
                    String(connectionReq._id),
                    connectionReq.userIdSender.toString()
                  );
                }}
              >
                אשר
              </Button>
              <Button
                type="default"
                onClick={() => rejectRequest(String(connectionReq._id))}
              >
                דחה
              </Button>
            </div>
          </div>
        );
        break;

      case "rejected":
        labelContent = `דחית את בקשת ההתחברות מ${connectionReq.sendersName}`;
        childrenContent = (
          <div>
            <p>דחית את בקשת ההתחברות של {connectionReq.sendersName}.</p>
            <p>התחרט/ת? רוצה לאשר את הבקשה?</p>
            <Button
              className="flex justify-start gap-4 mt-4"
              type="primary"
              onClick={async () => {
                await acceptRequest(
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
        labelContent = `אשרת את ההתחברות ל${connectionReq.sendersName}`;
        childrenContent = (
          <div>
            <p>
              ההתחברות למשתמש {connectionReq.sendersName} בוצעה בהצלחה,
              ברכותינו.
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

  const handleReadTheRequest = async (key: string | string[]) => {
    try{
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
  }
  catch(error){
    console.log("error updating the alerts is readen" , error);
  }
  };

  const acceptRequest = async (requestId: string, sender: string) => {
    console.log("accepted");
    try {
      const response = await updateRequestStatus(requestId, "accepted");
      const updateResponse = await updateConnections(sender, userId);
      if (response.status === 403 || updateResponse.status === 403){
        toast.error(" אין לך הרשאה לאשר התחברות לחשבון שאינו שלך");
        return;
      }
      setRequests((prevRequests) =>
        prevRequests.map((request) => {
          if (request.key === requestId) {
            return {
              ...request,
              status: "accepted",
              label: (
                <span
                  style={{ fontWeight: request.readen ? "normal" : "bold" }}
                >{`אשרת את ההתחברות ל${request.sender_name}`}</span>
              ),
              children: (
                <div>
                  <p>
                    ההתחברות למשתמש {request.sender_name} בוצעה בהצלחה,
                    ברכותינו.
                  </p>
                </div>
              ),
            };
          }
          return request;
        })
      );
    } catch (error) {
      console.error("Failed to update connection:", error);
      if (axios.isAxiosError(error)) {
        const serverError =
          error.response?.data?.error || "Unknown server error";
        const status = error.response?.status || 501;

        if (status === 400) {
          toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
        } else if (status === 404) {
          toast.error("בקשת ההתחברות הזו לא נמצאת במערכת");
        } else if (status === 500) {
          toast.error(`שגיאת שרת: ${serverError}`);
        } else {
          toast.error("אירעה שגיאה לא צפויה בשרת");
        }
      } else {
        toast.error(" אירעה שגיאה בעת עיבוד אישור ההתחברות, נסה שוב");
      }
    }
  };

  const rejectRequest = async (requestId: string) => {
    console.log("rejected");
    try {
      const response = await updateRequestStatus(requestId, "rejected");
      if (response.status === 403)
        toast.error(" אין לך הרשאה לדחות התחברות לחשבון שאינו שלך");
      setRequests((prevRequests) =>
        prevRequests.map((request) => {
          if (request.key === requestId) {
            return {
              ...request,
              status: "rejected",
              label: `דחית את בקשת ההתחברות ל${request.sender_name}`,
              children: (
                <div>
                  <p>דחית את בקשת ההתחברות של משתמש {request.sender_name}.</p>
                  <p>התחרט/ת? רוצה לאשר את הבקשה?</p>
                  <Button
                    className="flex justify-start gap-4 mt-4"
                    type="primary"
                    onClick={async () => {
                      await acceptRequest(
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
      if (axios.isAxiosError(error)) {
        const serverError =
          error.response?.data?.error || "Unknown server error";
        const status = error.response?.status || 501;

        if (status === 400) {
          toast.error("שגיאה בקבלת נתונים בשרת, נסה שוב.");
        } else if (status === 404) {
          toast.error("בקשת ההתחברות הזו לא נמצאת במערכת");
        } else if (status === 500) {
          toast.error(`שגיאת שרת: ${serverError}`);
        } else {
          toast.error("אירעה שגיאה לא צפויה בשרת");
        }
      } else {
        toast.error(" אירעה שגיאה בעת עיבוד דחיית ההתחברות, נסה שוב");
      }
    }
  };

  const renderRequests = (status: string) =>
    requests
      .filter((request) => request.status === status)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="rtl-tabs h-full flex flex-col">
      <Tabs
        defaultActiveKey="pending"
        className="h-full flex flex-col"
        items={[
          //בקשות שטרם נענו
          {
            key: "pending",
            label: "ממתינות",
            children: (
              <div className="tab-content">
                <Collapse
                  items={renderRequests("pending").map((request) => ({
                    ...request,
                    readen: "true",
                  }))}
                  onChange={(key) => handleReadTheRequest(key)}
                />
              </div>
            ),
          },
          //בקשות שאושרו
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
                  onChange={(key) => handleReadTheRequest(key)}
                />
              </div>
            ),
          },
          //בקשות שנדחו
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
                  onChange={(key) => handleReadTheRequest(key)}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ConnectionReq;
