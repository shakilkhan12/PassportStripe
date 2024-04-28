"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Google, Github } from "grommet-icons";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

export default function Form() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const mutation = useMutation((data) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API}/api/signin`, data, {
      withCredentials: true,
    });
  });
  const githubmMutation = useMutation(() => {
    return axios.post(`${process.env.NEXT_PUBLIC_API}/api/github`, null, {
      withCredentials: true,
    });
  });
  console.log(githubmMutation);
  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };
  const github = () => {
    window.open(`${process.env.NEXT_PUBLIC_API}/api/github`, "_self");
  };
  const google = () => {
    window.open(`${process.env.NEXT_PUBLIC_API}/api/google`, "_self");
  };
  useEffect(() => {
    if (mutation.isSuccess) {
      redirect("/dashboard");
    }
  }, [mutation.isSuccess]);

  return (
    <div className="flex items-center justify-center h-screen p-10">
      <Card className="w-full md:w-[400px] relative">
        {mutation.isLoading && (
          <div className="absolute inset-0 w-full h-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Loader />
          </div>
        )}

        <CardHeader>
          <CardTitle className="capitalize">Sign in</CardTitle>

          <Link href="/auth/signup" className="mt-2 block">
            Create new account?{" "}
            <span className="underline font-semibold">Signup</span>
          </Link>
          {mutation?.error?.response?.data?.message && (
            <span className="bg-rose-50 block w-full px-4 py-2 rounded-lg border border-rose-100 text-rose-600 text-sm font-medium !mt-3">
              {mutation?.error?.response?.data?.message}
            </span>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  name="email"
                  value={state.email}
                  onChange={onChange}
                />
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
              </div>
              <Button className="w-full bg-green-500">Sign in</Button>
            </div>
          </form>
          <div className="mt-5 flex items-center">
            <span className="flex-1 h-[1px] bg-slate-200"></span>
            <span className="px-2 text-sm">OR</span>
            <span className="flex-1 h-[1px] bg-slate-200"></span>
          </div>
          <Button
            className="mt-5 w-full bg-white border border-gray-300 text-zinc-700 hover:text-black hover:bg-white"
            onClick={github}
          >
            <Github className="mr-2 h-5 w-5" />
            Sign in with Github
          </Button>
          <Button
            className="mt-5 w-full bg-white border border-gray-300 text-zinc-700 hover:text-black hover:bg-white"
            onClick={google}
          >
            <Google className="mr-2" size="medium" color="plain" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
