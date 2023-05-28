import { useContext, useState, useEffect } from 'react';
import { Context } from '../../context';
import { Button } from 'antd';
import axios from 'axios';
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useRouter } from "next/router";


const BecomeInstructor = () => {
    // State
    const [loading, setLoading] = useState(false);
    const {
        state: { user },
        dispatch,
    } = useContext(Context);

    // Router
    const router = useRouter();

    const becomeInstructor = () => {
        const res = axios.post('/api/create-instructor');
        setLoading(false);
        router.push("/user/callback");
        return;
        setLoading(true);
        axios.post('/api/create-instructor').then((res) => {
            setLoading(false);
            router.push("/user/callback");
        }).catch(err => {
            toast("Error creating instructor role");
            setLoading(false);
        });
    };

    return (
        <>
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold">Become an Instructor</div>
            <div className="container pt-3">
                <div className='row'>
                    <div className='col-md-6 offset-md-3 text-center'>
                        <div className='pt-4'>
                            <UserSwitchOutlined className='display-1 pb-3' />
                            <br />
                            <h2></h2>

                            <Button
                                className="mb-3"
                                type="primary"
                                block
                                shape="round"
                                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                                size="large"
                                onClick={becomeInstructor}
                                disabled={
                                (user && user.role && user.role.includes("Instructor")) ||
                                loading
                                }
                            >
                                {loading ? "Processing..." : "Become An Instructor"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BecomeInstructor;