import {fetchUsersConnectionReq, updateConnections, updateRequestReadable, updateRequestStatus} from "@/app/services/ConnectionsServices";
import { AlertProps } from "@/app/types/IAlert";
import IConnectionRequest, {RequestTypeFotCollapse,} from "@/app/types/IConnectionRequest";
import { Button, Collapse, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ConnectionReq: React.FC<AlertProps> = ({userId, decreaseAlertCounter}) => {
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
      const connections: IConnectionRequest[] = await fetchUsersConnectionReq(userId);

      connections.forEach((connectionReq: IConnectionRequest) => {
        const { labelContent, childrenContent } = getHTMLContentOfTheRequest(connectionReq.status, connectionReq); 

        returnConnectionRequests.push({
          key: String(connectionReq._id),
          sender: connectionReq.userIdSender,
          status: connectionReq.status,
          sender_name: connectionReq.sendersName,
          date: connectionReq.date,
          label: (<span style={{ fontWeight: connectionReq.readen ? "normal" : "bold" }}>{labelContent}</span>),
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


  const getHTMLContentOfTheRequest = (status: string,connectionReq: IConnectionRequest) => {
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
                  await acceptRequest(
                    String(connectionReq._id),
                    connectionReq.userIdSender.toString()
                  );
                }}>אשר</Button>
              <Button
                type="default"
                onClick={() => rejectRequest(String(connectionReq._id))}>
                דחה</Button>
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
                await acceptRequest(
                  String(connectionReq._id),
                  connectionReq.userIdSender.toString()
                );
              }}>אשר
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


  const handleReadTheRequest = async (key: string | string[]) => {
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


  const acceptRequest = async (requestId: string, sender: string) => {
    console.log("accepted");
    try {
      await updateConnections(sender, userId);
      await updateRequestStatus(requestId, "accepted");

      setRequests((prevRequests) =>
        prevRequests.map((request) => {
          if (request.key === requestId) {
            return {
              ...request,
              status: "accepted",
              label: (
                <span style={{ fontWeight: request.readen ? "normal" : "bold" }}>{`You have connected to user ${request.sender_name}`}</span>),
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

    } catch (error) {
      console.error("Failed to update connection:", error);
      toast.error("Failed to accept the connection request.");
    }
  };


  const rejectRequest = async (requestId: string) => {
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
      toast.error("Failed to reject the connection request.");
    }
  };


  const renderRequests = (status: string) =>
    requests
      .filter((request) => request.status === status)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="rtl-tabs h-full flex flex-col">
      <Tabs
        defaultActiveKey="waiting"
        className="h-full flex flex-col"
        items={[
            //בקשות שטרם נענו
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
