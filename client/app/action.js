"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export const auth = async () => {
  const getCookies = cookies();
  const userCookie = getCookies.get("passport_jwt");
  let user = null;
  user = getCookies.get("passport_user");
  console.log("user -> ", user);
  if (user?.value) {
    user = JSON.parse(user.value);
  }
  if (userCookie) {
    const decoded = jwtDecode(userCookie.value);
    const expired = new Date(decoded.exp * 1000);
    if (new Date() > expired) {
      try {
        await axios.post(`${process.env.API}/logout`);
        return { auth: false, user };
      } catch (error) {
        return { auth: true, user };
      }
    } else {
      return { auth: true, user };
    }
  } else {
    return { auth: false, user };
  }
};
