import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/index.js";
import { useEffect } from "react";
import { toastMessage } from "../../utils/helper.js";
import EmptyChatContainer from "./components/empty-chat-container/index.jsx";
import ContactsContainer from "./components/contacts-container/index.jsx";
import ChatContainer from "./components/chat-container/index.jsx";

export default function Chat() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toastMessage("error", "Please setup profile to continue..");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {/* <EmptyChatContainer /> */}
      <ChatContainer />
    </div>
  );
}
