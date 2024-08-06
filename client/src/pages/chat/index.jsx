import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/index.js";
import { useEffect } from "react";
import { toastMessage } from "../../utils/helper.js";

export default function Chat() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toastMessage("error", "Please setup profile to continue..");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return <div>Chat</div>;
}
