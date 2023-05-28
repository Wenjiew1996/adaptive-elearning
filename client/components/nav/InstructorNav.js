import Link from 'next/link';
import { useState, useEffect } from 'react';

const InstructorNav = () => {
    const[current, setCurrent] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrent(window.location.pathname);
        }
    }, [(typeof window !== "undefined") && window.location.pathname]);
    
    return (
        <div className='nav flex-column nav-pills'>
            <Link href="/instructor" className={`nav-link ${current === '/instructor' && "active"}`}>Dashboard</Link>
            <Link href="/instructor/course/create" className={`nav-link ${current === '/instructor/course/create' && "active"}`}>Create Course</Link>
        </div>
    );
};

export default InstructorNav;