import { useAuth } from "@/auth";

export default function Account() {
  const { user } = useAuth();

  return <div>
    <h2>hello, {user}</h2>
  </div>
}
