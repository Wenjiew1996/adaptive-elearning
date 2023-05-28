import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // State
    const { state, dispatch } = useContext(Context);
    const { user } = state;

    // Router
    const router = useRouter();

    useEffect(() => {
        if (user !== null) router.push("/user");
    }, [user]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post('/api/login', {
                email,
                password,
            });

            // Update state
            dispatch({
                type: "LOGIN",
                payload: data,
            });
            
            // Save in the local storage when a user logs in
            window.localStorage.setItem('user', JSON.stringify(data));
 
        } catch (err) {
            toast.error(err.response.data);
            setLoading(false);
        };
    };
    return (
        <>
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold">Login</div>
            <div className="container col-md-4 offset-md-4 pb-5v pt-3">
                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        className="form-control mb-4 p-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                    <input
                        type="password"
                        className="form-control mb-4 p-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg"
                            disabled={!email || !password || loading}
                        >
                            {loading ? <LoadingOutlined spin /> : "Submit"}
                        </button>
                    </div>
                </form>

                <p className="text-center pt-3">
                    Not yet registered?{" "}
                    <Link href="/register">Register</Link>
                </p>

                <p className="text-center">
                    <Link href="/reset-password">Reset Password</Link>
                </p>
            </div>
        </>
    );
};

export default Login;