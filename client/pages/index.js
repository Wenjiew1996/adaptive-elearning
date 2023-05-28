import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/cards/CourseCard';

// Receive courses as props for server side rendering (see getServerSideProps())
const Index = ({courses}) => {
    // const [courses, setCourses] = useState([]);

    // useEffect renders on component mount at first instance. - not server side rendering for dynamic content
    // useEffect(() => {
    //     const getCourses = async () => {
    //         const { data } = await axios.get('/api/courses');
    //         setCourses(data);
    //     };
    //     getCourses();
    // }, []);

    return (
        <>
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold shadow">Adaptive E-learning Platform</div>
            <div className='container-fluid pt-3'>
                <div className='row'>
                    {courses.map((course) =>(
                        <div className='col-md-4' key={course._id}>
                            <CourseCard 
                                course={course}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export async function getServerSideProps() {
    // const { data } = await axios.get(`${process.env.API}/courses`);
    const { data } = await axios.get(`http://localhost:8000/api/courses`);
    return {
        props: {
            courses: data,
        },
    };
};

export default Index;