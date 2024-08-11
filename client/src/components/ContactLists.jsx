import { HOST } from "../utils/constants";
import { useAppStore } from "../store";
import { getColor } from "../lib/utils";

const ContactLists = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          key={contact._id}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <div className="h-10 w-10 rounded-full overflow-hidden">
                {contact?.image ? (
                  <img
                    src={`${HOST}${contact?.image}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={` ${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[#ffffff22] border-2 border-white/70"
                        : getColor(contact?.color)
                    } h-10 w-10 uppercase text-lg border-[1px] flex items-center justify-center rounded-full`}
                  >
                    {contact?.firstName
                      ? contact?.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </div>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span className="font-medium">{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactLists;
