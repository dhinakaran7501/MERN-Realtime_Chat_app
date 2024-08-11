import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import Victory from "../../assets/victory.svg";
import Background from "../../assets/login2.png";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toastMessage } from "../../utils/helper.js";
import { apiClient } from "../../lib/api-client.js";
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "../../utils/constants.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/index.js";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setemail] = useState("dhinakings123@gmail.com");
  const [password, setpassword] = useState("Dheena@123");
  const [confirmpassword, setconfirmpassword] = useState("");

  const validateLogin = () => {
    if (!email.length) {
      toastMessage("error", "Please Enter your email.");
      return false;
    }
    if (!password.length) {
      toastMessage("error", "Please Enter your Password.");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toastMessage("error", "Please Enter your email.");
      return false;
    }
    if (!password.length) {
      toastMessage("error", "Please Enter your Password.");
      return false;
    }
    if (password !== confirmpassword) {
      toastMessage("error", "Password and confirm password should be same.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(
          LOGIN_ROUTES,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        const { status, message, data } = response?.data;
        if (status === 1) {
          if (data?.id) {
            setUserInfo({ ...data });
            if (data?.profileSetup) {
              navigate("/chat");
            } else {
              navigate("/profile");
            }
          }
          // Reset Input Field
          setemail("");
          setpassword("");
          setconfirmpassword("");
        } else {
          toastMessage("error", message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await apiClient.post(
          SIGNUP_ROUTES,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        const { status, message } = response?.data;
        if (status === 1) {
          toastMessage("success", message);
          navigate("/login");

          // Reset Input Field
          setemail("");
          setpassword("");
          setconfirmpassword("");
        } else {
          toastMessage("error", message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-5">
                <Input
                  placeholder="Enter Your Email"
                  type="email"
                  className="rounded-sm p-5"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="Enter Your Password"
                  type="password"
                  className="rounded-sm p-5"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="flex flex-col gap-5">
                <Input
                  placeholder="Enter Your Email"
                  type="email"
                  className="rounded-sm p-5"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="Enter Your Password"
                  type="password"
                  className="rounded-sm p-5"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  placeholder="Re-enter Your Password"
                  type="password"
                  className="rounded-sm p-5"
                  value={confirmpassword}
                  onChange={(e) => setconfirmpassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="xl:flex justify-center items-center hidden">
          <img
            src={Background}
            alt="Background"
            className="h-[700px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
