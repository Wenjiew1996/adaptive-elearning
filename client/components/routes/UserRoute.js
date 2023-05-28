import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";

import UserNav from "../nav/UserNav";

// Only when the correct User is trying to access the page is the content visible
const UserRoute = ({ children }) => {
    // State
    const [ok, setOk] = useState(false);
    
    // Router
    const router = useRouter();
    
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/current-user');
            if (data.ok) setOk(true);
        } catch (err) {
            setOk(false);
            router.push("/login");
        };
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            {!ok ? (
                <LoadingOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />
            ) : (
                <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-2">
                                <UserNav />
                            </div>
                            <div className="col-md-10">{children}</div>
                    </div>
                </div>
            )}
        </>
    );
};
export default UserRoute;