"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Redirect = () => {
  const router = useRouter();
  const session = useSession();
  if (session.data?.user) {
    router.push("/dashboard");
  }else{
    router.push('/')
  }
  return null;
};

export default Redirect;
