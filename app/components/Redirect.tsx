"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

const Redirect = () => {
  const router = useRouter();
  const session = useSession();
  if (session.data?.user) {
    router.push("/dashboard");
  }
  return null;
};

export default Redirect;
