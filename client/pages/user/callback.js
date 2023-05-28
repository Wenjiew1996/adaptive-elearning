import { useContext, useEffect } from "react";
import { Context } from "../../context";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";


const InstructorCallback = () => {
    const {
        state: { user },
        dispatch,
    } = useContext(Context);
    // Router
    const router = useRouter();

    useEffect(() => {
        if (user) {
            axios.post("/api/get-account-status").then((res) => {
                dispatch({
                    type: "LOGIN",
                    payload: res.data,
                });
                window.localStorage.setItem("user", JSON.stringify(res.data));
                // window.location.href = "/instructor";
                router.push("/instructor");
            });
        }
    }, [user]);

    return (
    <SyncOutlined
        spin
        className="d-flex justify-content-center display-1 text-danger p-5"
    />
    );
};

export default InstructorCallback;