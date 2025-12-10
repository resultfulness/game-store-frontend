import { useAuth } from "@/auth";
import Button from "./Button";
import Input from "./Input";
import "./LoginModal.css";
import { useEffect, useRef, useState, type FormEvent } from "react";

interface LoginModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginModal({ open, setOpen }: LoginModalProps) {
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (open) {
            dialog.current!.showModal();
        } else {
            dialog.current!.close();
        }
    }, [open]);

    useEffect(() => {
        dialog.current!.addEventListener("close", () => setOpen(false));
    })

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({ username: "", password: "" })

    const { login } = useAuth();

    function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({ username: "", password: "" })
        const fd = new FormData(e.target as HTMLFormElement);
        const username = fd.get("username");
        const password = fd.get("password");

        if (!username) {
            setErrors(errors => ({ ...errors, username: "username required" }));
            return;
        }

        if (!password) {
            setErrors(errors => ({ ...errors, password: "password required" }));
            return;
        }

        login(username.toString(), password.toString());
        setOpen(false);
        setUsername("");
        setPassword("");
    }

    return <dialog className="login-modal" ref={dialog} closedby="any">
        <h2 className="login-modal-title">Login to your account</h2>
        <form onSubmit={handleLogin} className="login-form">
            <Input
                label="username:"
                type="text"
                name="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                error={errors.username}
            />
            <Input
                label="password:"
                type="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
            />
            <Button>login</Button>
        </form>
    </dialog>;
}
