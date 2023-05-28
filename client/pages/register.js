import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        state: { user },
    } = useContext(Context);

    const router = useRouter();

    useEffect(() => {
        if (user !== null) router.push("/");
    }, [user]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post('/api/register', {
                name,
                email,
                password,
            });
            toast.success("Registration successful. Please login.");
            setName('');
            setEmail('');
            setPassword('');
            setLoading(false);
        } catch (err) {
            toast.error(err.response.data);
            setLoading(false);
        };
    };
    return (
        <>
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold">Register</div>
            <div className="container col-md-4 offset-md-4 pb-5v pt-3">
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        className="form-control mb-4 p-4"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        required
                    />
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
                            disabled={!name || !email || !password || loading}
                        >
                            {loading ? <LoadingOutlined spin /> : "Submit"}
                        </button>
                    </div>
                </form>

                <p className="text-center p-3">
                    Already registered?{" "}
                    <Link href="/login">Login</Link>
                </p>
            </div>
        </>
    );
};

export default Register;