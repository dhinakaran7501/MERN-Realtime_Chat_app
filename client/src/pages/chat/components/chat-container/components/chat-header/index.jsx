import { HOST } from "../../../../../../utils/constants";
import { useAppStore } from "../../../../../../store";
import { RiCloseFill } from "react-icons/ri";
import { getColor } from "../../../../../../lib/utils";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center ">
          <div className="flex items-center gap-3 justify-center ">
            <div className="h-20 relative flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                {selectedChatData?.image ? (
                  <img
                    src={`${HOST}${selectedChatData?.image}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`h-10 w-10 uppercase text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData?.color
                    )}`}
                  >
                    {selectedChatData?.firstName
                      ? selectedChatData?.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </div>
            </div>
          </div>
          {selectedChatType === "contact" && selectedChatData.firstName
            ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
            : selectedChatData.email}
        </div>
        <div className="flex gap-5 items-center justify-center">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
