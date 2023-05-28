import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";
import AddQuizForm from "../../../../components/forms/AddQuizForm";
import EditQuizForm from "../../../../components/forms/EditQuizForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Item from "antd/lib/list/Item";
import { DeleteOutlined, PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, List, Modal, Tooltip } from 'antd';

const handleEditQuiz = (quiz, setEditQuiz) => {
    console.log("quiz", quiz);
    setEditQuiz(true);
}

const handleDeleteQuiz = async (item, lessonId, slug) => {
    const ans = window.confirm("Are you sure you want to delete this quiz? This operation cannot be undone.");
    if (!ans) return;
    const quizId = item._id;
    // 得到要删掉的question
    // let lessons = values.lessons;
    // const deletedLesson = lessons.splice(index, 1);
    // setValues({ ...values, lessons: lessons });
    // // Request backend to delete storage of lesson in DB
    const { data } = await axios.delete(`/api/course/lesson/quiz/${slug}/${lessonId}/${quizId}`);
    console.log(data);
}

const PrintQuizTitle = (props) => {
    return (
        <div style={{display:'flex', justifyContent:'space-between'}}>
            {props.item.question.length > 50 && <div>{`Quiz${props.value}: ${props.item.question.slice(0, 50)}...`}</div>}
            {props.item.question.length <= 50 && <div>{`Quiz${props.value}: ${props.item.question}`}</div>}
            <div style={{display: 'flex', justifyContent:'flex-end'}}>
                <Tooltip title="Edit Quiz">
                    <EditOutlined
                        className="me-5 text-success h5"
                        onClick={() => handleEditQuiz(props.item, props.setEditQuiz)}
                    />
                </Tooltip>
                <Tooltip title="Delete Quiz">
                    <DeleteOutlined 
                        className="me-5 text-danger float-right h5"    
                        onClick={() => handleDeleteQuiz(props.item, props.lessonId, props.slug)}
                    />
                </Tooltip>
            </div>
        </div>
    )
}

const ListQuiz = (props) => {
    return(
        <List
        dataSource={props.quiz}
        renderItem={(item, key) => (
            <Item key={key}>
                <Item.Meta
                title={<PrintQuizTitle slug={props.slug} lessonId={props.lessonId} value={key+1} item={item} setEditQuiz={props.setEditQuiz}/>}
            />
            </Item>
            
        )}>
        </List>
    )
}

const PrintTitle = (props) => {
    return (
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <div onClick={() => {props.setOpen(true); props.setCurrent(props.quiz);}}>{props.quiz.title}</div>
            {/* Add a Quiz questions */}
            <div style={{display: 'flex', justifyContent:'flex-end'}}>
                <Tooltip title="Add a Quiz">
                    <PlusCircleOutlined
                        className="me-5 text-success h5"
                        onClick={() => {
                            console.log(props);
                            props.setOpenQuiz(true);
                            props.setCurrent(props.quiz);
                        }}
                    />
                </Tooltip>
                <Tooltip title="Delete Lesson">
                    <DeleteOutlined 
                        className="me-5 text-danger float-right h5"    
                        onClick={() => props.handleDelete(props.index)}
                    />
                </Tooltip>
            </div>
        </div>
    )
}

const CourseEdit = () => {
    // State
    const [values, setValues] = useState({
        name: "",
        description: "",
        uploading: false,
        category: "",
        loading: false,
        imagePreview: "",
        lessons: [],
    });
    const [preview, setPreview] = useState('');
    const [uploadButtonDesc, setUploadButtonDesc] = useState('Upload Image or Course Icon');
    const [image, setImage] = useState({});

    // State: Lessons Updating
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState({});
    const [uploadVideoButtonDesc, setUploadVideoButtonDesc] = useState('Upload Video');
    const [progressBar, setProgressBar] = useState(0);
    const [uploading, setUploading] = useState(false);
    // PDF Updating
    const [pdfText, setPdfText] = useState("Upload PDF");
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [progressBarPdf, setProgressBarPdf] = useState(0);

    // Adding Quiz
    const [openQuiz, setOpenQuiz] = useState(false);
    const [editQuiz, setEditQuiz] = useState(false);

    // Router
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        loadCourse();
    }, [slug]);

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        if(data) setValues(data);
        if(data) console.log(data);
        if(data && data.image) setImage(data.image);
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        let image = e.target.files[0];
        setPreview(window.URL.createObjectURL(image));
        setUploadButtonDesc(image.name);
        setValues({ ...values, loading: true });
        // Resize the image for storage
        Resizer.imageFileResizer(image, 750, 600, "JPEG", 100, 0, async (uri) => {
            try {
                let { data } = await axios.post('/api/course/upload-image', {
                    image: uri,
                });
                // Set image in the state and notify
                setImage(data);
                setValues({ ...values, loading: false });
                toast("Image successfully uploaded.");
            } catch (err) {
                setValues({ ...values, loading: false });
                toast("Image upload unsuccessful. Please try again.");
            }
        })
    };


    // Remove image from S3 using the key
    const handleImageRemove = async () => {
        try {
            setValues({ ...values, loading: true });
            const res = await axios.post('/api/course/remove-image', { image });
            setImage({});
            setPreview('');
            setUploadButtonDesc('Upload Image or Course Icon');
            setValues({ ...values, loading: false });
        } catch (err) {
            setValues({ ...values, loading: false });
            toast("Image upload unsuccessful. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/api/course/${slug}`, {
                ...values,
                image,
            });
            toast("Course updated successfully.");
        } catch (error) {
            toast(error.response.data);
        }
    };

    // Deleting a lesson
    const handleDelete = async (index) => {
        const ans = window.confirm("Are you sure you want to delete this lesson? This operation cannot be undone.");
        if (!ans) return;
        let lessons = values.lessons;
        const deletedLesson = lessons.splice(index, 1);
        setValues({ ...values, lessons: lessons });
        // Request backend to delete storage of lesson in DB
        const { data } = await axios.put(`/api/course/${slug}/${deletedLesson[0]._id}`);
    };

    // Handle updating lesson in the DB
    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        const { data } = await axios.put(`/api/course/lesson/${slug}/${current._id}`, current);
        // Close modal after updated
        setUploadVideoButtonDesc('Upload Video');
        setPdfText('Upload PDF');
        setOpen(false);   
        // Refresh UI with updated data
        if (data.ok) {
            let arr = values.lessons;
            const index = arr.findIndex((elem) => elem._id === current._id);
            arr[index] = current;
            setValues({ ...values, lessons: arr });
            toast("Lesson updated successfully");
        }
    };

    const handleAddQuiz = async (e) => {
        e.preventDefault();
        console.log("current:", current._id);
        console.log("current:", current);
        const { data } = await axios.put(`/api/course/lesson/quiz/${slug}/${current._id}`, current);
        // console.log("data", data);
        setOpenQuiz(false);
        
        if (data.ok) {
            let arr = values.lessons;
            //current._id = lesson id
            const index = arr.findIndex((elem) => elem._id === current._id);
            arr[index] = current;
            // console.log({ ...values, lessons: arr });
            console.log("here");
            console.log({...current, question: ''});
            setValues({ ...values, lessons: arr });
            setCurrent({ ...current, question: '' });
            toast("Quiz added successfully");
        }

    };

    // Lesson updating PDF Uploads
    const handlePdf = async (e) => {
        // Delete previously uploaded PDF
        if (current?.pdf && current?.pdf?.Location) {
            const res = await axios.post(`/api/course/pdf-remove/${values.instructor._id}`, current.pdf);
        }
        // Upload new pdf
        const pdf = e.target.files[0];
        setPdfText(pdf.name);
        setUploadingPdf(true);

        // Prep pdf as form data
        const pdfData = new FormData();
        pdfData.append('pdf', pdf);
        pdfData.append('courseId', values._id);

        // Save progress bar and send pdf to backend
        const { data } = await axios.post(`/api/course/pdf-upload/${values.instructor._id}`, pdfData, {
            onUploadProgress: (e) => setProgressBarPdf(Math.round((e.loaded * 100) / e.total)),
        });
        setCurrent({ ...current, pdf: data });
        setUploading(false);
    };

    // Lesson updating video uploads
    const handleVideo = async (e) => {
        // Delete previously uploaded video
        if (current?.video && current?.video?.Location) {
            const res = await axios.post(`/api/course/video-remove/${values.instructor._id}`, current.video);
        }
        // Upload new video
        const video = e.target.files[0];
        setUploadVideoButtonDesc(video.name);
        setUploading(true);

        // Prep video as form data
        const videoData = new FormData();
        videoData.append('video', video);
        videoData.append('courseId', values._id);

        // Save progress bar and send video to backend
        const { data } = await axios.post(`/api/course/video-upload/${values.instructor._id}`, videoData, {
            onUploadProgress: (e) => setProgressBar(Math.round((e.loaded * 100) / e.total)),
        });
        setCurrent({ ...current, video: data });
        setUploading(false);
    };

    // for reordering items
    const handleDrag = (e, index) => {
        e.dataTransfer.setData('position', index);
    };

    // for reordering items
    const handleDrop = async (e, index) => {
        const movingItemPosition = e.dataTransfer.getData('position');
        const targetPosition = index;
        // Retrieve existing lessons
        let lessons = values.lessons;
        // Get the dragged item
        let movingItem = lessons[movingItemPosition];
        // Remove the dragged item
        lessons.splice(movingItemPosition, 1);
        // Push the dragged item to the target position
        lessons.splice(targetPosition, 0, movingItem);
        // Update the state
        setValues({ ...values, lessons: [...lessons] });
        // Update the list order in the DB
        const { data } = await axios.put(`/api/course/${slug}`, {
            ...values,
            image,
        });
    };
    
    //fetch all quizzes of one Learning Object
    const handleAllQuizs = () => {

    }
    return (
        <InstructorRoute>
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold shadow">Edit Course</div>
            <div className="pt-3 pb-3">
                <CourseCreateForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleChange={handleChange}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    uploadButtonDesc={uploadButtonDesc}
                    handleImageRemove={handleImageRemove}
                    editPage={true}
                />
            </div>
            <hr/>
            <div className="row pb-5">
                <div className="col lessons-list">
                    <h4>{values && values?.lessons && values?.lessons.length} Lessons</h4>
                    <List
                        itemLayout="horizontal"
                        dataSource={values && values.lessons}
                        onDragOver={(e) => e.preventDefault()}
                        renderItem={(item, index) => (
                            <Item
                                draggable
                                onDragStart={(e) => handleDrag(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <Item.Meta
                                    avatar={<Avatar>{index + 1}</Avatar>}
                                    title={<PrintTitle quiz={item} setOpen={setOpen} setCurrent={setCurrent}
                                    setOpenQuiz={setOpenQuiz} handleDelete={handleDelete} index={index}/>}
                                    onClick={()=>console.log('values', values)}
                                    description={<ListQuiz slug={slug} lessonId={item._id} quiz={item.questions} setEditQuiz={setEditQuiz}/>}
                                ></Item.Meta>
                            </Item>
                        )}
                    ></List>
                </div>
            </div>

            <Modal
                title="Add Quiz Question"
                centered
                visible={openQuiz}
                onCancel={() => setOpenQuiz(false)}
                footer={null}
            >
                <AddQuizForm 
                    current={current}
                    setCurrent={setCurrent}
                    handleAddQuiz={handleAddQuiz}
                />
            </Modal>

            <Modal
                title="Edit Quiz Question"
                centered
                visible={editQuiz}
                onCancel={() => setEditQuiz(false)}
                footer={null}
            >
                <EditQuizForm
                    current={current}
                    setCurrent={setCurrent}
                    handleAddQuiz={handleEditQuiz}
                />
            </Modal>

            <Modal
                title="Update Lesson"
                centered
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <UpdateLessonForm 
                    current={current}
                    setCurrent={setCurrent}
                    handleUpdateLesson={handleUpdateLesson}
                    handleVideo={handleVideo}
                    uploadVideoButtonDesc={uploadVideoButtonDesc}
                    progressBar={progressBar}
                    uploading={uploading}
                    pdfText={pdfText}
                    uploadingPdf={uploadingPdf}
                    progressBarPdf={progressBarPdf}
                    handlePdf={handlePdf}
                />
            </Modal>

        </InstructorRoute>
    );
};

export default CourseEdit;
