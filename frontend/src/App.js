import "./App.scss";

const axios = require("axios").default;

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminPage from "./admin/AdminPage";
import UserPage from "./user/UserPage";

import { useEffect, useState } from "react";

import { GetAuthConfig, LoginSession, LogoutSession } from "./AuthenticationStorage";

function RequireAuth({ children }) {
    const [view, setView] = useState(<h2>Checking authentication...</h2>);

    useEffect(() => {
        const authConfig = GetAuthConfig();

        if (authConfig.headers.Authorization === "") {
            setView(<Navigate to="/login" replace />);
        } else {
            axios.get("http://localhost:3001/login-check", authConfig)
                .then((res) => {
                    console.log("Auth check returned", res);

                    if (res.status === 200)
                        setView(children);
                    else
                        setView(<Navigate to="/login" replace />);
                });
        }
    }, [children]);

    return view;
}

function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginText, setLoginText] = useState("");

    const onLogin = () => {
        axios.post("http://localhost:3001/login", { username, password })
            .then((res) => {
                console.log("Login returned", res);

                if (res.status === 200) {
                    console.log("Login result", res.data);
                    LoginSession(res.data);
                    navigate("/admin", { replace: true });
                }
            })
            .catch((err) => {
                if (err?.response?.status === 404) {
                    setLoginText("Incorrect login");
                }
            });
    };

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "100px" }}>
            <div>
                <div className="form-group" style={{ paddingBottom: "20px" }}>
                    <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group" style={{ paddingBottom: "20px" }}>
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={onLogin}>Login</button>
                <div style={{ marginTop: "20px" }}>
                    {loginText}
                </div>
            </div>
        </div>
    );
}

function LogoutPage() {
    useEffect(() => {
        LogoutSession();
    }, []);

    return <Navigate to="/login" replace />;
}

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <UserPage />
                    }
                />
                <Route
                    path="/login"
                    element={
                        <LoginPage />
                    }
                />
                <Route path="/logout"
                    element={
                        <LogoutPage />
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <RequireAuth>
                            <AdminPage />
                        </RequireAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
