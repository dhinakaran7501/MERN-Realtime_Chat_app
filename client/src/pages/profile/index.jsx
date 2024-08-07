import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store/index.js";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { colors, getColor } from "../../lib/utils.js";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { toastMessage } from "../..//utils/helper.js";
import { apiClient } from "../../lib/api-client.js";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "../../utils/constants.js";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const fileInputref = useRef(null);

  useEffect(() => {
    if (userInfo?.profileSetup) {
      const { firstName, lastName, color, image } = userInfo ?? {};

      setFirstName(firstName);
      setLastName(lastName);
      setSelectedColor(color);

      if (image) {
        if (image.startsWith("data:")) {
          console.log(image);

          setImage(image);
        } else {
          console.log(image);
          setImage(`${HOST}/${image}`);
        }
      }
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toastMessage("error", "First name is required");
      return false;
    }
    if (!lastName) {
      toastMessage("error", "Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor,
          },
          { withCredentials: true }
        );
        console.log(response);
        const { status, message, data } = response?.data;

        if (status === 1) {
          setUserInfo({ ...data });
          toastMessage("success", message);
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toastMessage("error", "Please Setup profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputref.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const response = await apiClient.post(
          ADD_PROFILE_IMAGE_ROUTE,
          formData,
          { withCredentials: true }
        );

        const { status, message, data } = response?.data;
        if (status === 1) {
          toastMessage("success", message);
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            image: data?.image,
          }));

          const reader = new FileReader();
          reader.onload = () => {
            setImage(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          toastMessage("error", "Failed to update profile image");
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
        toastMessage(
          "error",
          "An error occurred while uploading the profile image."
        );
      }
    }
  };

  const handelDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      const { status, message } = response?.data;
      if (status === 1) {
        toastMessage("success", message);
        setUserInfo({ ...userInfo, image: null });
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
        <div className="flex flex-col gap-10 w-[80vw] md:w-max">
          <div className="">
            <IoArrowBack
              className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
              onClick={handleNavigate}
            />
          </div>
          <div className="grid grid-cols-2">
            <div
              className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`h-32 w-32 md:w-48 md:h-48 uppercase text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedColor
                    )}`}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : userInfo.email.split("").shift()}
                  </div>
                )}
              </div>
              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer ring-fuchsia-50"
                  onClick={image ? handelDeleteImage : handleFileInputClick}
                >
                  {/* <FaPlus className="text-white text-3xl cursor-pointer" /> */}
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputref}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept="image/*"
            />
            <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
              <div className="w-full">
                <Input
                  placeholder="Email"
                  type="email"
                  disabled
                  value={userInfo.email}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full">
                <Input
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full">
                <Input
                  placeholder="Second Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full flex gap-5">
                {colors?.map((color, index) => (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                    ${
                      selectedColor === index
                        ? "outline outline-white outline-2"
                        : ""
                    }
                    `}
                    key={index}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            <Button
              className="h-16 w-full bg-purple-500 hover:bg-purple-900 transition-all duration-300"
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
