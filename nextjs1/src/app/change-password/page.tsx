"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function ChangePassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

 

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { oldPassword, newPassword, confirmPassword } = values;

      const response = await axios.post("/api/users/change-password", {
        token,
        oldPassword,
        confirmPassword,
        newPassword,
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message);

        await axios.get("/api/users/logout");

        router.push("/login");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 ">
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 py-8 mb-4 w-96"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Old Password
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...field}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Old Password"
                  />
                </FormControl>
                <FormDescription className="text-gray-600 text-xs italic">
                  Please provide a valid old password
                </FormDescription>
                <FormMessage className="text-red-500 text-xs italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  New Password
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...field}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="New Password"
                  />
                </FormControl>
                <FormDescription className="text-gray-600 text-xs italic">
                  Please provide a valid new password
                </FormDescription>
                <FormMessage className="text-red-500 text-xs italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...field}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Confirm Password"
                  />
                </FormControl>
                <FormDescription className="text-gray-600 text-xs italic">
                  make sure current password and new password are same
                </FormDescription>
                <FormMessage className="text-red-500 text-xs italic" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-center mt-6">
            {loading ? (
              <Button
                type="submit"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
              >
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
              >
                Change Password
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
