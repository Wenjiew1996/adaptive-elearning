import axios from 'axios';
import { useState, useEffect } from 'react';
import InstructorRoute from '../../components/routes/InstructorRoute';
import { Avatar, Tooltip } from 'antd';
import Link from 'next/link';
import { CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';

const InstructorIndex = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const { data } = await axios.get("/api/instructor-courses");
        setCourses(data);
    };

    const pStyle = {
        marginTop: '-10px',
        fontSize: '12px',
    };
    return (
        <InstructorRoute>
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold shadow">Instructor Dashboard</div>
            {courses && courses.map(course => (
                <>
                    <div className='d-flex pt-4 pb-1' key={course}>
                        <div className='flex-shrink-0'>
                        <Avatar size={80} src={course.image ? course.image.Location : '/course_default.png'}/>
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <div className='row'>
                                <div className='col'>
                                    <Link className="pointer" href={`/instructor/course/view/${course.slug}`}>
                                        <h4 className='pt-2'>{course.name}</h4>
                                    </Link>
                                    <p style={{ marginTop: "-10px" }}>{course.lessons.length} Lessons</p>
                                    {course.lessons.length < 3 ? (
                                        <p style={pStyle} className="text-danger">Minimum 3 lessons are required to publish a course</p>
                                    ) : course.published ? (
                                        <p style={pStyle} className="text-success">This course has already been published</p>
                                    ): (
                                        <p style={pStyle} className="text-success">This course is ready to be published</p>      
                                    )}                                    
                                </div>
                                <div className='col-md-3 mt-3 text-center'>
                                    {course.published ? (
                                        <Tooltip title="Published">
                                            <div><CheckCircleOutlined className='h5 pointer text-success'/></div>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Unpublished">
                                            <div><CloseCircleOutlined className='h5 pointer text-danger' /></div>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ))}
            <br/>
        </InstructorRoute>
    );
};

export default InstructorIndex;