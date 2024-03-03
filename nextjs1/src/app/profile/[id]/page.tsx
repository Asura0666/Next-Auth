"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type UserSchema = {
  email: string;
  userName: string;
  _id: string;
  isVerified: boolean;
  isAdmin: boolean;
};

const UserProfile = ({ params }: any) => {
  const [user, setUser] = useState<UserSchema>({
    email: "",
    userName: "",
    _id: "",
    isVerified: false,
    isAdmin: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/users/me");

      if (response.data && response.data.success) {
        setUser(response.data.data);
        toast.success("User fetched successfully");
      }
    } catch (error: any) {
      toast.error("Failed to fetch user data");
      console.error(error.message);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users/sendmail");

      if (response.data && response.data.success) {
        // Trigger re-fetch of user data after sending email
        fetchUserData();
        toast.success("Email sent successfully");
      }
    } catch (error: any) {
      toast.error("Failed to send email");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchUserData();
    }
  }, [params]);

  const changePassword = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users/sendmail");

      if (response.data && response.data.success) {
        // Trigger re-fetch of user data after sending email
        fetchUserData();
        toast.success("Email sent successfully");
      }
    } catch (error: any) {
      toast.error("Failed to send email");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <Toaster />
      <h1 className="text-2xl text-white">Profile Page {params?.id}</h1>

      <div className="flex flex-col justify-center items-center space-y-4 text-lg text-white">
        <ul className="flex flex-col">
          <li>UserName: {user.userName}</li>
          <li>Email: {user.email}</li>
        </ul>

        <Button
          onClick={onClick}
          disabled={isLoading || user.isVerified}
          className={`px-4 py-2 rounded font-bold text-lg ${
            user.isVerified
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {!user.isVerified && isLoading
            ? "Sending Email..."
            : user.isVerified
            ? "Verified"
            : "Not Verified"}
        </Button>
        <Button
          onClick={changePassword}
          disabled={isLoading || !user.isVerified}
          className="px-4 py-2 rounded-none font-bold text-lg bg-slate-600 text-black"
        >
          {user.isVerified && isLoading? "sending Email" :"Change-Password"}
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
