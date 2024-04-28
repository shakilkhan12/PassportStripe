"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorsConversion } from "@/utils/errorHelper";
import axios from "axios";
import classNames from "classnames";
import { Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

export default function Form() {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const mutation = useMutation((data) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API}/api/signup`, data, {
      withCredentials: true,
    });
  });
  console.log(mutation.error);
  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };
  useEffect(() => {
    if (mutation.isError) {
      if (
        mutation?.error?.response?.status === 400 &&
        mutation?.error?.response?.data?.type === "array"
      ) {
        setErrors(errorsConversion(mutation?.error?.response?.data?.message));
      } else if (
        mutation?.error?.response?.status === 400 &&
        mutation?.error?.response?.data?.type === "string" &&
        mutation?.error?.response?.data?.field === "email"
      ) {
        setErrors({
          ...errors,
          email: mutation?.error?.response?.data?.message,
        });
      } else {
        alert("Server internal error");
      }
    }
  }, [mutation.isError]);
  console.log(errors);
  return (
    <div className="flex items-center justify-center h-screen p-10">
      <Card className="w-full md:w-[400px] relative overflow-hidden">
        {mutation.isLoading && (
          <div className="absolute inset-0 w-full h-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Loader />
          </div>
        )}
        <CardHeader>
          <CardTitle className="capitalize">Create a new account</CardTitle>
          <Link href="/auth/signin" className="mt-2 block">
            Already have an account?{" "}
            <span className="underline font-semibold">Signin</span>
          </Link>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  name="name"
                  value={state.name}
                  onChange={onChange}
                />
                {errors?.name && (
                  <span className="text-rose-600 text-sm">{errors?.name}</span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  name="email"
                  value={state.email}
                  onChange={onChange}
                />
                {errors?.email && (
                  <span className="text-rose-600 text-sm">{errors?.email}</span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={state.password}
                  onChange={onChange}
                />
                {errors?.password && (
                  <span className="text-rose-600 text-sm">
                    {errors?.password}
                  </span>
                )}
              </div>
              <Button className="w-full !bg-green-500">Sign Up</Button>
            </div>
          </form>
          <div className="mt-5 flex items-center">
            <span className="flex-1 h-[1px] bg-slate-200"></span>
            <span className="px-2 text-sm">OR</span>
            <span className="flex-1 h-[1px] bg-slate-200"></span>
          </div>
          <Button className="mt-5 w-full bg-white border border-gray-300 text-zinc-700 hover:text-black hover:bg-white">
            <Github className="mr-2 h-5 w-5" />
            Sign Up with Github
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
