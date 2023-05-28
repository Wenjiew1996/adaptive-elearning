import { useState } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CreateCourseForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";


const CreateCourse = () => {
    // State
    const [values, setValues] = useState({
        name: "",
        description: "",
        uploading: false,
        category: "",
        loading: false,
        imagePreview: "",
    });
    const [preview, setPreview] = useState('');
    const [uploadButtonDesc, setUploadButtonDesc] = useState('Upload Image or Course Icon');
    const [image, setImage] = useState({});

    // Router
    const router = useRouter();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    // Show preview of uploaded image
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
            const { data } = await axios.post('/api/course', {
                ...values,
                image,
            });
            toast("Course created successfully. Please add lessons to the course to publish.");
            router.push('/instructor');
        } catch (err) {
            toast(err.response.data);
        }

    };
    // Pass functions to create course form below
    return (
        <InstructorRoute>
            <div className="bg-light py-5 d-flex justify-content-center display-1 fw-bold  shadow">Create a Course</div>
            <div className="pt-3 pb-3">
                <CreateCourseForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleChange={handleChange}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    uploadButtonDesc={uploadButtonDesc}
                    handleImageRemove={handleImageRemove}
                />
            </div>
            <hr />

        </InstructorRoute>
    );
};

export default CreateCourse;