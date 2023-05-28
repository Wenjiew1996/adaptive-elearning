import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";



// Only when the correct Student is trying to access the page is the content visible
const StudentRoute = ({ children }) => {
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
                    {children}
                </div>
            )}
        </>
    );
};
export default StudentRoute;