import { Button, Badge, Modal } from 'antd';
import { LoadingOutlined, BulbOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
import ReactMarkdown from "react-markdown";

const SingleCourseDiv = ({ course, open, setOpen, preview, setPreview, loading, user, handleCourseEnrollment, enrolled, setEnrolled }) => {
    // Destructure course details
    const { name, description, instructor, updatedAt, lessons, image, category } = course;

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-8'>
                    <h1 className="p-3 mb-4 font-weight-bold rounded-3 text-center square">{name}</h1>
                    <hr/>
                    <ReactMarkdown children={description}></ReactMarkdown>
                    <Badge style={{ backgroundColor: '#000080' }} className="pb-2 mr-2" count={category} />
                    <p>Created by {instructor.name}</p>
                    <p>Last updated on {new Date(updatedAt).toLocaleDateString()}</p>
                    <br/><br/>
                </div>
                <div className='col-md-4'>
                    {/* Display either the preview video or the image */}
                    {lessons[0]?.video && lessons[0]?.video?.Location ? (
                        <div onClick={() => {
                            setPreview(lessons[0].video.Location);
                            setOpen(!open);
                        }}
                        >
                            <ReactPlayer
                                className="react-player-div"
                                url={lessons[0].video.Location}
                                playing={false}
                                // controls={true}
                                light={image ? image.Location : "/course_default.png"}
                                width='100%'
                                height="240px"
                            />
                        </div>
                        ) : (
                            <>
                                <img className='img img-fluid' src={image.Location} alt={name} />
                            </>
                        )}

                        {loading ? (
                            <div className='display-flex justify-content-center'>
                                <LoadingOutlined className='h1 text-danger'/>
                            </div>
                        ) : (
                            <div>
                                <Button
                                    className='mt-3 mb-3'
                                    block
                                    shape='round'
                                    type='primary'
                                    size='large'
                                    icon={<BulbOutlined />}
                                    disabled={loading}
                                    onClick={handleCourseEnrollment}
                                >
                                    {user ?
                                        enrolled.status
                                            ? "Go To Course "
                                            : "Enrol In Course"
                                        : "Please Login To Enrol"}
                                </Button>
                            </div>    
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleCourseDiv;