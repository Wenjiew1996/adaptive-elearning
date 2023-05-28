import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { Context } from "../context";
import { useRouter } from "next/router";

const ResetPassword = () => {
    // State
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Context
    const { state: { user } } = useContext(Context);
    
    // Router
    const router = useRouter();

    // If user is logged in, redirect
    useEffect(() => {
        if (user !== null) router.push("/");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/reset-password', { email });
            setSuccess(true);
            toast("Please check your email for the password reset code");
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast(err.response.data);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post('/api/resetting-password', {
                email,
                code,
                newPassword,
            });
            setEmail('');
            setCode('');
            setNewPassword('');
            setLoading(false);
            toast("Please login with your new password.");
        } catch (err) {
            setLoading(false);
            toast(err.response.data);
        }
    };

    return (
        <>
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold">Reset Password</div>
            <div className="container col-md-4 offset-md-4 pb-5 pt-3">
                <form onSubmit={success ? handlePasswordReset : handleSubmit}>
                    <input
                        type="email"
                        className="form-control mb-4 p-4"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                    {success && (
                        <>
                            <input
                                type="text"
                                className="form-control mb-4 p-4"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="Enter code"
                                required
                            />
                            <input
                                type="password"
                                className="form-control mb-4 p-4"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </>
                    )}
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !email}>
                            {loading ? <LoadingOutlined spin /> : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ResetPassword; 