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

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({ login: "", password: "" })

    function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({ login: "", password: "" })
        const fd = new FormData(e.target as HTMLFormElement);
        const login = fd.get("login");
        const password = fd.get("password");

        if (!login) {
            setErrors(errors => ({ ...errors, login: "login required" }));
        }

        if (!password) {
            setErrors(errors => ({ ...errors, password: "password required" }));
            return;
        }
    }

    return <dialog className="login-modal" ref={dialog} closedby="any">
        <h2 className="login-modal-title">Login to your account</h2>
        <form onSubmit={handleLogin} className="login-form">
            <Input
                label="login:"
                type="text"
                name="login"
                value={login}
                onChange={e => setLogin(e.target.value)}
                error={errors.login}
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
