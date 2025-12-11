import { useAuth } from "@/auth";

export default function Account() {
  const { user } = useAuth();

  return <>
    {user &&
      <div>
        <h2>hello, {user.username}</h2>
        <div>
          <p>
            dear user,
          </p>
          this is your password <pre>{user.password}</pre>
          this is your email <pre>{user.email}</pre>
        </div>
      </div>
    }
  </>;
}
