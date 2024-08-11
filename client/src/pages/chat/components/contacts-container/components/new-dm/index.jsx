import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../components/ui/tooltip";
import {
  animationDefaultOptions,
  getColor,
} from "../../../../../../lib/utils.js";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { Input } from "../../../../../../components/ui/input";
import Lottie from "react-lottie";
import { apiClient } from "../../../../../../lib/api-client";
import { HOST, SEARCH_CONTACT_ROUTE } from "../../../../../../utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useAppStore } from "../../../../../../store";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setopenNewContactModal] = useState(false);
  const [searchedContacts, setsearchedContacts] = useState([]);

  const handleSearchContact = async (searchterm) => {
    try {
      if (searchterm?.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT_ROUTE,
          { searchterm },
          {
            withCredentials: true,
          }
        );
        const { status, data } = response?.data;
        if (status === 1) {
          setsearchedContacts(data);
        } else {
          setsearchedContacts([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setopenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setsearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-sm text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-400 cursor-pointer transition-all duration-300"
              onClick={() => setopenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setopenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">
              Please select a contact
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Search contact"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              onChange={(e) => handleSearchContact(e.target.value)}
            />
          </div>

          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col">
                {[
                  searchedContacts?.map((contact, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => selectNewContact(contact)}
                    >
                      <div className="flex items-center gap-3 justify-center ">
                        <div className="h-20 relative flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            {contact?.image ? (
                              <img
                                src={`${HOST}${contact?.image}`}
                                alt="Profile"
                                className="object-cover w-full h-full bg-black"
                              />
                            ) : (
                              <div
                                className={`h-10 w-10 uppercase text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                                  contact?.color
                                )}`}
                              >
                                {contact?.firstName
                                  ? contact?.firstName.split("").shift()
                                  : contact.email.split("").shift()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-medium">
                          {contact?.firstName && contact?.lastName
                            ? `${contact?.firstName} ${contact?.lastName}`
                            : contact.email}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    </div>
                  )),
                ]}
              </div>
            </ScrollArea>
          )}

          {searchedContacts.length < 1 && (
            <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span>
                  Search new<span className="text-purple-500"> Contact. </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
