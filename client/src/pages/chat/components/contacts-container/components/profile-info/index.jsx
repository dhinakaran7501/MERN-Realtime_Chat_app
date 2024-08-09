import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { getColor } from "../../../../../../lib/utils";
import { useAppStore } from "../../../../../../store";
import { HOST, LOGOUT_ROUTE } from "../../../../../../utils/constants";
import React from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../../lib/api-client.js";
import { toastMessage } from "../../../../../../utils/helper";
import { IconButton, Tooltip } from "@mui/material";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const handleLogOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );

      const { status, message } = response?.data;
      if (status === 1) {
        toastMessage("success", message);
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute bottom-0 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex items-center gap-3 justify-center ">
        <div className="h-20 relative flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            {userInfo?.image ? (
              <img
                src={`${HOST}/${userInfo?.image}`}
                alt="Profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`h-10 w-10 uppercase text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo?.color
                )}`}
              >
                {userInfo?.firstName
                  ? userInfo?.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </div>
        </div>
        <p className="font-medium">
          {userInfo?.firstName && userInfo?.lastName
            ? `${userInfo?.firstName} ${userInfo?.lastName}`
            : `${userInfo.firstName}`}
        </p>
      </div>
      <Tooltip title="Edit" placement="top">
        <IconButton>
          <FiEdit2
            className="text-purple-500 text-xl font-medium cursor-pointer"
            onClick={() => navigate("/profile")}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Log out" placement="top">
        <IconButton>
          <IoPowerSharp
            className="text-red-500 text-xl font-medium cursor-pointer"
            onClick={handleLogOut}
          />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ProfileInfo;
