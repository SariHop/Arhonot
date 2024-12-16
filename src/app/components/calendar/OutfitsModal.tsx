import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { IDayWithLooks, IOutfitsModalProps } from "../../types/IDay";
import UserOutfits from "./UserOutfits";
import { getChildrenLooks } from "@/app/services/daysService";
import axios from "axios";
import { toast } from "react-toastify";

const OutfitsModal: React.FC<IOutfitsModalProps> = ({isOpen, setIsOpen, dateDetails, date}) => {
  const [childrensLooks, setChildrensLooks] = useState<Record<string, IDayWithLooks>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadChildrenOutfits();
    }
  }, [isOpen, dateDetails]);

  const loadChildrenOutfits = async () => {
    setIsLoading(true); // הצגת טוען
    try {
      const response = await getChildrenLooks(String(dateDetails.userId), date);
      setChildrensLooks(response);
    } catch (error) {
      console.error("Failed to process user looks:", error);
      if (axios.isAxiosError(error)) {
        const serverError =
          error.response?.data?.error || "Unknown server error";
        toast.error(`Server Error: ${serverError}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false); // הסרת טוען
    }
  };

  const handleClose = () => {
    setChildrensLooks({});
    setIsOpen(false);
  };

  return (
    <Modal
      title="הלוקים שלך"
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      style={{maxHeight: '75vh', overflowY: "auto"}}
    >
      {isLoading ? (
        <p className="text-center">טוען נתונים...</p>
      ) : (
        <>
          <UserOutfits looks={dateDetails?.looks || []} />
          {Object.entries(childrensLooks).map(([name, child], index) => {
            if (child?.looks.length > 0) {
              return (
                <div key={index}>
                  <p className="font-semibold">הלוקים של {name}</p>
                  <UserOutfits looks={child?.looks || []} />
                </div>
              );
            }
            return null;
          })}
        </>
      )}
    </Modal>
  );
};

export default OutfitsModal;
