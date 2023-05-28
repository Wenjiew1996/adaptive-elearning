import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import { MenuOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, UserOutlined, UserAddOutlined, TeamOutlined, ReadOutlined} from '@ant-design/icons'
import { Context } from "../context";
import axios from 'axios';
import { toast } from "react-toastify";
import { useRouter } from "next/router";


const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
    const [current, setCurrent] = useState("");

    const { state, dispatch } = useContext(Context);
    const { user } = state;

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrent(window.location.pathname);
        }
    }, [(typeof window !== "undefined") && window.location.pathname]);

    // Logout, update state, remove local storage, request backend, send notification and redirect to login
    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        window.localStorage.removeItem("user");
        const { data } = await axios.get("/api/logout");
        toast(data.message);
        router.push("/login");
    };

    return (
        <Menu theme="dark" mode="horizontal" selectedKeys={[current]} className="mb-3">
            <Item key="/" onClick={e => setCurrent(e.key)} icon={<HomeOutlined />}>
                <Link href="/">Home</Link>
            </Item>

            {user && user.role && user.role.includes("Instructor") ? (
                <Item key="/instructor/course/create" onClick={e => setCurrent(e.key)} icon={<ReadOutlined />}>
                    <Link href="/instructor/course/create">Create Course</Link>
                </Item>
            ): (
                <Item key="/user/become-instructor" onClick={e => setCurrent(e.key)} icon={<TeamOutlined />}>
                    <Link href="/user/become-instructor">Become Instructor</Link>
                </Item>     
            )}    



            {user == null && (
                <>
                    <Item key="/login" onClick={e => setCurrent(e.key)} icon={<LoginOutlined />}>
                        <Link href="/login">Login</Link>
                    </Item>
                    <Item key="/register" onClick={e => setCurrent(e.key)} icon={<UserAddOutlined />}>
                        <Link href="/register">Register</Link>
                    </Item>
                </>
            )}

            {user && user.role && user.role.includes("Instructor") && (
                <Item key="/instructor" onClick={e => setCurrent(e.key)} icon={<TeamOutlined />}>
                    <Link href="/instructor">Instructor</Link>
                </Item>
            )}

            {user !== null && (
                <SubMenu key='default' icon={<MenuOutlined />} title={user.name} style={{ marginLeft: 'auto' }} >
                    <ItemGroup>
                        <Item key="/user" onClick={e => setCurrent(e.key)} icon={<UserOutlined />}>
                            <Link href="/user">Dashboard</Link>
                        </Item>
                        <Item key="/logout" onClick={logout} icon={<LogoutOutlined />}>Logout</Item>
                    </ItemGroup>
                </SubMenu>
            )}


        </Menu>
    );
};

export default TopNav;