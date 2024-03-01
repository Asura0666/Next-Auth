"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import router from "next/navigation";
import axios from "axios";

const formSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
});

const loginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log(values);

      const response = await axios.post("/api/users/login", values);

      if (response?.data && response.data.success) {
        // If the backend response indicates success
        toast.success("Login Successfully!");
        router.push("/profile");
      } 

    } catch (error: any) {
      console.log("Signup failed", error);
      // If an error occurs during the request, show a generic error message
      console.log(3);
      
      toast.error(error.response.data.error || "Unable to create User");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <Toaster/>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 py-8 mb-4 w-96"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </FormLabel>
                <FormControl>
                  <input
                    type="email"
                    {...field}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Email"
                  />
                </FormControl>
                <FormDescription className="text-gray-600 text-xs italic">
                  Please provide a valid email address.
                </FormDescription>
                <FormMessage className="text-red-500 text-xs italic" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </FormLabel>
                <FormControl>
                  <input
                    type="password"
                    {...field}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Password"
                  />
                </FormControl>
                <FormDescription className="text-gray-600 text-xs italic">
                  Password must be at least 6 characters long.
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
                Sign In
              </Button>
            )}
          </div>
        </form>
      </Form>
      <span className="text-white">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-400">
          Sign Up
        </Link>
      </span>
    </div>
  );
};

export default loginPage;
