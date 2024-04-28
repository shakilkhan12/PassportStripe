"use client";
import Link from "next/link";
import React from "react";
import { Profile } from "./Profile";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
const Nav = ({ user }) => {
  // useEffect(() => {
  //  const data = localStorage.getItem('')
  // }, [])
  const { push } = useRouter();
  console.log(user);
  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      push("/auth/signin");
    } catch (error) {
      console.log(error);
      alert("logout failed");
    }
  };
  return (
    <div className="bg-white border-b">
      <div className="max-w-screen-xl w-full mx-auto">
        <div className="h-20 flex items-center justify-between gap-5">
          <Link href="/dashboard">Dashboard</Link>
          <Profile user={user} />
          <button onClick={logout}>logout</button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
