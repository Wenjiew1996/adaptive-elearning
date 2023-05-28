import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import PreviewModal from '../../components/modal/PreviewModal';
import SingleCourseDiv from '../../components/cards/SingleCourseDiv';
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { Context } from '../../context';


// Receive single course as props for server side rendering (see getServerSideProps())
const SingleCourse = ({course}) => {
    // State
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState({});

    // Context: get the user
    const {
        state: { user },
    } = useContext(Context);

    //
    useEffect(() => {
        if (user && course) checkEnrolment();
    }, [user, course]); // empty array required to avoid infinite loop



    // Router
    const router = useRouter();
    const { slug } = router.query;

    const checkEnrolment = async () => {
        const { data } = await axios.get(`/api/enrolment-check/${course._id}`);
        setEnrolled(data);
    };

    const handleCourseEnrollment = async (e) => {
        e.preventDefault();
        try {
            if (!user) router.push('/login');
            if (enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`);

            setLoading(true);
            const { data } = await axios.post(`/api/enrolment/${course._id}`);
            toast(data.message);
            setLoading(false);
            router.push(`/user/course/${data.course.slug}`);
        } catch (error) {
            console.log(error);
            toast('Enrolment unsuccessful. Please try again.');
            setLoading(false);
        }
    };

    
    return (
        <>
            <SingleCourseDiv 
                course={course}
                open={open}
                setOpen={setOpen}
                preview={preview}
                setPreview={setPreview}
                user={user}
                loading={loading}
                handleCourseEnrollment={handleCourseEnrollment}
                enrolled={enrolled}
                setEnrolled={setEnrolled}
            />


            <PreviewModal
                open={open}
                setOpen={setOpen}
                preview={preview}
            />

            {course?.lessons && (
                <SingleCourseLessons 
                    setPreview={setPreview}
                    open={open}
                    setOpen={setOpen}
                    lessons={course.lessons}
                />
            )}
        </>
    )

};

export async function getServerSideProps({query}) {
    // const { data } = await axios.get(`${process.env.API}/courses`);
    const { data } = await axios.get(`http://localhost:8000/api/course/${query.slug}`);
    return {
        props: {
            course: data,
        },
    };
};

export default SingleCourse;