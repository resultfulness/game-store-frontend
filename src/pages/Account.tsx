import { useAuth } from "@/auth";
import { api } from "@/services/api";
import { type User } from "@/types/user";
import { useEffect, useState } from "react";

export default function Account() {
  const { user } = useAuth();

  return <div>
    <h2>hello, {user.username}</h2>
    <div>
      <p>
        dear user,
      </p>
      this is your password <pre>{user.password}</pre>
      this is your email <pre>{user.email}</pre>
    </div>
  </div>;
}
