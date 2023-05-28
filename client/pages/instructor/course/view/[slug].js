import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { Avatar, Tooltip, Button, Modal, List } from 'antd';
import { EditOutlined, CheckCircleOutlined, UploadOutlined, QuestionCircleOutlined, CloseCircleOutlined, UserOutlined } from "@ant-design/icons";
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from 'react-toastify';
import Item from "antd/lib/list/Item";



// Dynamically creating a course view for each course
const CourseView = () => {
    // State course
    const [course, setCourse] = useState({});
    // State lessons
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({
        title: "",
        content: "",
        LO: "",
        preconditions: "",
        video: {},
        pdf: {},
    });
    const [uploading, setUploading] = useState(false);
    const [videoText, setVideoText] = useState("Upload Video");
    const [progressBar, setProgressBar] = useState(0);
    // PDF uploading
    const [pdfText, setPdfText] = useState("Upload PDF");
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [progressBarPdf, setProgressBarPdf] = useState(0);

    // Number of students
    const [students, setStudents] = useState(0);

    // Retrieve the slug
    const router = useRouter();  
    const { slug } = router.query;   
    
    useEffect(() => {
        loadCourse();
    }, [slug]);

    useEffect(() => {
        course && countStudents();
    }, [course]);

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        setCourse(data);
    };

    const countStudents = async () => {
        const { data } = await axios.post(`/api/instructor/count-students`, {
            courseId: course._id,
        });
        setStudents(data.length);
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, values);
            setValues({ ...values, title: '', content: '', video: {}, pdf: {}, LO: '', preconditions:'' });
            setProgressBar(0);
            setProgressBarPdf(0);
            setVideoText('Upload Video');
            setPdfText('Upload PDF');
            setOpen(false);
            setCourse(data);
            toast("Lesson added successfully");
        } catch (error) {
            toast("Lesson add fail");
        }
    };

    const handlePdfUpload = async (e) => {
        try {
            const file = e.target.files[0];
            setPdfText(file.name);
            // send pdf file to backend
            setUploadingPdf(true);
            const pdfData = new FormData();
            pdfData.append('pdf', file);
            const { data } = await axios.post(`/api/course/pdf-upload/${course.instructor._id}`, pdfData, {
                onUploadProgress: (e) => {
                    setProgressBarPdf(Math.round((e.loaded * 100) / e.total))
                }
            });
            setValues({ ...values, pdf: data });
            setUploadingPdf(false);
        } catch (error) {
            setUploadingPdf(false);
            toast("PDF upload failed");
        }
    };

    const handlePdfRemove = async (e) => {
        try {
            setUploadingPdf(true);
            const { data } = await axios.post(`/api/course/pdf-remove/${course.instructor._id}`, values.pdf);
            setValues({ ...values, pdf: {} });
            setUploadingPdf(false);
            setProgressBarPdf(0);
            setPdfText('Upload another PDF');
        } catch (error) {
            setUploadingPdf(false);
            toast("PDF remove failed");
        }
    };

    const handleVideoUpload = async (e) => {
        try {
            const file = e.target.files[0]
            setVideoText(file.name);
            // send video file to backend
            setUploading(true);
            const videoData = new FormData();
            videoData.append('video', file);
            const { data } = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
                onUploadProgress: (e) => {
                    setProgressBar(Math.round((e.loaded * 100) / e.total))
                }
            });
            setValues({ ...values, video: data });
            setUploading(false);
        } catch (error) {
            setUploading(false);
            toast("Video upload failed");
        }
    };
    const handleVideoRemove = async (e) => {
        try {
            setUploading(true);
            const { data } = await axios.post(`/api/course/video-remove/${course.instructor._id}`, values.video);
            setValues({ ...values, video: {} });
            setUploading(false);
            setProgressBar(0);
            setVideoText('Upload another video');
        } catch (error) {
            setUploading(false);
            toast("Video remove failed");
        }
    };

    const handleUnpublish = async (e, courseId) => {
        try {            
            let ans = window.confirm("Are you sure you want to unpublish? This action makes the course unavailable for student enrolment");
            if (!ans) return;
            const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
            setCourse(data);
            toast("This course has been unpublished");
        } catch (error) {
            toast("Course failed to unpublish. Please try again");
        }
    };

    const handlePublish = async (e, courseId) => {
        try {
            let ans = window.confirm("Are you sure you want to publish? This action makes the course available for student enrolment");
            if (!ans) return;
            const { data } = await axios.put(`/api/course/publish/${courseId}`);
            setCourse(data);
            toast("This course has been published");
        } catch (error) {
            toast("Course failed to publish. Please try again");
        }
    };

    return (
        <InstructorRoute>
            <div className="container-fluid pt-4">
                {course && (
                    <div className="container pt-2">
                        <div className="row pt-2">
                            <div className="col-1 col-md-2">
                                <Avatar 
                                    size={80}
                                    src={course.image ? course.image.Location : "/course_default.png"}
                                />
                            </div>
                            <div className="col-sm">
                                <h5 className="mt-2 text-primary">{course.name}</h5>
                                <p style={{ marginTop: "-10px" }}>
                                    {course.lessons && course.lessons.length} Lessons
                                </p>
                                <p style={{ marginTop: "-15px", fontSize: "12px" }}>
                                    {course.category}
                                </p>
                            </div>
                            <div className="col-md-3 mt-3 text-center">
                                <Tooltip title={`${students} Enrolled`}>
                                    <UserOutlined
                                        className="h5 pointer text-info me-4" 
                                    />
                                </Tooltip>
                            
                                <Tooltip title="Edit">
                                    <EditOutlined
                                        className="h5 pointer text-warning me-4" 
                                        onClick={() => router.push(`/instructor/course/edit/${slug}`)}    
                                    />
                                </Tooltip>
                                {course?.lessons && course?.lessons.length < 3 ? (
                                    <Tooltip title="Minimum 3 lessons are required to publish a course">
                                        <QuestionCircleOutlined className="h5 pointer text-danger" />
                                    </Tooltip>
                                ) : course?.published ? (
                                        <Tooltip title="Unpublish">
                                            <CloseCircleOutlined
                                                className="h5 pointer text-danger"
                                                onClick={(e) => handleUnpublish(e, course._id)}
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Publish">
                                            <CheckCircleOutlined
                                                className="h5 pointer text-success"
                                                onClick={(e) => handlePublish(e, course._id)}
                                            />
                                        </Tooltip>
                                )}
                            </div>
                        </div>
                        <br/>
                        <hr/>
                        <div className="row">
                            <div className="col">
                                <ReactMarkdown children={course.description}></ReactMarkdown>
                            </div>
                        </div>
                        <br/>
                        <div className="row pt-2 pb-2">
                            <Button
                                onClick={() => setOpen(true)}
                                className="col-md-6 offset-md-3"
                                type="primary"
                                shape="round"
                                icon={<UploadOutlined />}
                                size="large"
                            >
                                Create Lesson
                            </Button>
                        </div>

                        <Modal
                            title="+ Add a Lesson"
                            centered
                            visible={open}
                            onCancel={() => setOpen(false)}
                            footer={null}
                        >
                            <AddLessonForm
                                values={values}
                                setValues={setValues}
                                handleAddLesson={handleAddLesson}
                                uploading={uploading}
                                videoText={videoText}
                                handleVideoUpload={handleVideoUpload}
                                progressBar={progressBar}
                                handleVideoRemove={handleVideoRemove}
                                pdfText={pdfText}
                                handlePdfUpload={handlePdfUpload}
                                uploadingPdf={uploadingPdf}
                                progressBarPdf={progressBarPdf}
                                handlePdfRemove={handlePdfRemove}
                            />
                        </Modal>
                        <div className="row pb-5 pt-3">
                            <div className="col lessons-list">
                                <h4>{course && course?.lessons && course?.lessons.length} Lessons</h4>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={course && course.lessons}
                                    renderItem={(item, index) => (
                                        <Item>
                                            <Item.Meta
                                                avatar={<Avatar>{index + 1}</Avatar>}
                                                title={item.title}
                                            ></Item.Meta>
                                        </Item>
                                    )}
                                ></List>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </InstructorRoute>
    )
};

export default CourseView;