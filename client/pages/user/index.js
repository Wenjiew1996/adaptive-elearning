import axios from "axios";
import { Avatar } from 'antd';
import Link from 'next/link';
import { LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from "react";
import { Context } from '../../context';
import UserRoute from "../../components/routes/UserRoute";

// Only when the correct User is trying to access the page is the content visible
const UserIndex = () => {
    // State
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Context
    const { state: { user } } = useContext(Context);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/user-courses');
            setCourses(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <UserRoute>
            {loading && (
                <LoadingOutlined spin className="d-flex justify-content-center text-danger p-5 display-1"/>
            )}
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold shadow">User Dashboard</div>
            <div className="container pt-4">    
                {courses && courses.map((course) => (
                    <div className="row pb-3">
                        <div className="col-1">
                            <Avatar
                                size={100}
                                src={course.image ? course.image.Location : "course_default.png"}
                                shape="square"
                            />   
                        </div>
                        <div className="col-sm">                      
                            <Link className="pointer" href={`/user/course/${course.slug}`} >
                                <h4 className="text-primary mt-2">{course.name}</h4>
                            </Link>
                            <p style={{ marginTop: '-15px' }}>{course.lessons.length} Lessons</p>
                            <p style={{ marginTop: '-15px', fontSize: '12px' }} className="text-muted">Created by {course.instructor.name}</p>
                        </div>    
                            <div className="col-md-3 mt-3 text-center">
                                <Link className="pointer" href={`/user/course/${course.slug}`} >
                                    <PlayCircleOutlined className="h2 text-primary pointer"/>
                                </Link>
                            </div>
                    </div>
                ))}
            
            </div>
        </UserRoute>
    );
};
export default UserIndex;