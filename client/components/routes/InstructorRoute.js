import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import InstructorNav from "../nav/InstructorNav";

// Only when the correct Instructor is trying to access the page is the content visible
const InstructorRoute = ({ children }) => {
    // State
    const [ok, setOk] = useState(false);
    
    // Router
    const router = useRouter();
    
    const fetchInstructor = async () => {
        try {
            const { data } = await axios.get('/api/current-instructor');
            if (data.ok) setOk(true);
        } catch (err) {
            setOk(false);
            router.push("/");
        };
    };

    useEffect(() => {
        fetchInstructor();
    }, []);

    return (
        <>
            {!ok ? (
                <LoadingOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />
            ) : (
                <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-2">
                                <InstructorNav />
                            </div>
                            <div className="col-md-10">{children}</div>
                    </div>
                </div>
            )}
        </>
    );
};
export default InstructorRoute;