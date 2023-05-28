import { useState, useEffect, createElement } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Avatar, Menu, Button, Tooltip, Modal, Switch, Checkbox, Form } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, BorderOuterOutlined, QuestionCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import StudentRoute from '../../../components/routes/StudentRoute';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from "react-toastify";
const { Item } = Menu;

const IndividualCourse = () => {
    // State
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({ lessons: [] });
    const [render, setRender] = useState(true);
    // Which lesson has been selected
    const [selected, setSelected] = useState(-1);
    const [completedLessons, setCompletedLessons] = useState([]);
    // For the sidebar
    const [collapsed, setCollapsed] = useState(false);
    // To force a state update to refresh UI
    const [updateState, setUpdateState] = useState(false);
    // Quiz modal
    const [open, setOpen] = useState(false);
    const [countQuiz, setCountQuiz] = useState(0);
    const [quiz, setQuiz] = useState([]);
    const [response, setResponse] = useState(new Set());
    const [endQuiz, setEndQuiz] = useState(false);
    const [preReqQuiz, setPreReqQuiz] = useState([]);
    const [preQuizOpen, setPreQuizOpen] = useState(false);
    const [preQuizRes, setPreQuizRes] = useState([]);
    const [preRequisite, setPreRequisite] = useState([]);
    // Planner
    const [learningPath, setLearningPath] = useState([]);
    const [selectedPath, setSelectedPath] = useState([]);
    
    // Router
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        if (slug) loadCourse();
    }, [slug]);

    // If the course is in the state then load the completed lessons
    useEffect(() => {
        if (course) loadCompletedLessons();
    }, [course]);

    const loadCourse = async () => {
        // Public endpoint requires middleware. Restricts access to unenrolled students
        const { data } = await axios.get(`/api/user/course/${slug}`);
        setCourse(data);
    };

    const loadCompletedLessons = async () => {
        const { data } = await axios.post(`/api/lessons-completed`, {
            courseId: course._id,
        });
        setCompletedLessons(data);
    };

    const markCompleted = async () => {
        console.log("here", {
            courseId: course._id,
            lessonId: course.lessons[selected]._id,
            LO: course.lessons[selected].LO,
        });
        const { data } = await axios.post(`/api/mark-completed`, {
            courseId: course._id,
            lessonId: course.lessons[selected]._id,
            LO: course.lessons[selected].LO,
        });
        console.log("completed: ", data);
        setCompletedLessons([...completedLessons, course.lessons[selected]._id]);
    };

    const markIncompleted = async () => {
        try {
            const { data } = await axios.post(`/api/mark-incompleted`, {
                courseId: course._id,
                lessonId: course.lessons[selected]._id,
                LO: course.lessons[selected].LO,
            });
            // Need to force an update refresh of UI
            const allLessons = completedLessons;
            const index = allLessons.indexOf(course.lessons[selected]._id);
            // If the item is found
            if (index > -1) {
                allLessons.splice(index, 1);
                setCompletedLessons(allLessons);
                setUpdateState(!updateState);
            }
        } catch (error) {
            console.log(error);
        }
    };
    // PDF View config and state
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };
    const changePage = (offset) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    };

    const previousPage = () => {
        changePage(-1);
    };

    const nextPage = () => {
        //If it is the last page:
        //Randomly select a quiz question from all questions, and display
        changePage(1);
        console.log("num page", numPages);
        console.log("page num", pageNumber);
        if(numPages == pageNumber+1){
            console.log("here");
            handleQuiz();
            // Math.floor(Math.random() * 6);
            setOpen(true);
        }
    };

    const handleRecordAns = (e, setResponse, choosenAns) => {
        let newRes = response;
        if(e){
            newRes.add(choosenAns);
        }else{
            newRes.delete(choosenAns);
        }
        console.log(newRes);
        setResponse(newRes);
        setRender(r => !r);
    }

    const handlePlanner = async (LG) => {
        try {
            console.log(course);
            const learningGoal = "LO8";
            const { data } = await axios.post(`/api/planner/${LG}`, {
                courseId: course._id,
            });
            console.log(data);
            // Clear existing path for replan
            setLearningPath([]);
            setSelectedPath([]);

            // Map learning route to course
            data.map((lo, index) => {
                course.lessons.map((lesson, index) => {
                    if (lo == lesson.LO) {
                        setLearningPath(learningPath => learningPath.concat(lesson));
                        setSelectedPath(selectedPath => selectedPath.concat(index));
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleQuiz = async (e) => {
        try {
            const lessonId = course.lessons[selected]._id
            console.log(`/api/course/quiz/${slug}/${lessonId}`);
            const { data } = await axios.get(`/api/course/quiz/${slug}/${lessonId}`);
            console.log('quiz', data);
            setCountQuiz(Math.floor(Math.random() * data.length));
            console.log("this quiz is: ", data[countQuiz]);
            setQuiz(data);
        } catch (error) {
            console.log(error);
        }
    };

    const quizResponse = async (e) => {
        if (response === quiz[countQuiz].correct) {
            console.log("correct");
        } else {
            console.log("wrong");
        }
    };
//need to find pre-requisite of the current learning object
//check if all are completed, if not generate prior test quiz
    const handleClickLesson = async (index) => {
        console.log(selectedPath[index]);

        const lessonIndex = selectedPath[index];
        const LO = course.lessons[lessonIndex].LO;
        console.log(LO);
        console.log(course.lessons[lessonIndex]);
        console.log(completedLessons);
        const { data } = await axios.post(`/api/planner/${LO}`, {
            courseId: course._id,
        });
        const preReq = data.filter(m => m != LO);
        console.log("pre:", preReq);
        let quizzes = [];
        let res = [];
        if(preReq.length === 0){
            setSelected(selectedPath[index]);
        }else{
            //get quizzes - 循环所有的pre的questions，随机出一个
            for(let c of course.lessons){
                if(preReq.includes(c.LO)){
                    const quizChoosen = Math.floor(Math.random() * c.questions.length);
                    quizzes.push(c.questions[quizChoosen]);
                    res.push(new Set());
                }
            }
            console.log(quizzes);
            setPreQuizRes(res);
            setPreReqQuiz(quizzes);
            setPreQuizOpen(true);
            setPreRequisite(preReq);

        }
    }

    const handleSubmitQuiz = async (e) => {
        e.preventDefault();
        const ans = Array.from(response);
        console.log(ans[0] === quiz[countQuiz].correct);
        if (ans[0] === quiz[countQuiz].correct) {
            markCompleted();
            toast("Quiz answered correctly!");
            setOpen(false);
            console.log("here", {
                courseId: course._id,
                lessonId: course.lessons[selected]._id,
                LO: course.lessons[selected].LO,
            })
            // Generate the new PDDL Problem File for the user
            // const { data } = await axios.post(`/api/quiz/planner`, {
            //     courseId: course._id,
            //     lessonId: course.lessons[selected]._id,
            //     LO: course.lessons[selected].LO,
            // });
            // handlePlanner();
            // setRender(r => !r);
        } else {
            // markIncompleted();
            // toast("Quiz failed, please reviewing previous slides to study!");
            // setPageNumber(1);
            setOpen(false);
            setEndQuiz(true);
            // const { data } = await axios.post(`/api/quiz/planner`, {
            //     courseId: course._id,
            //     lessonId: course.lessons[selected]._id,
            //     LO: course.lessons[selected].LO,
            // });
            // handlePlanner();
        }
        setResponse(new Set());
    };

    const checkAns = (ans) => {
        if(response === new Set()){
            return false;
        }
        if(quiz.length === 0){
            return false;
        }else{
            if(response.has(quiz[countQuiz][ans])){
                return true;
            }else{
                return false;
            }
        }
    }

    const handleSubmitPreQuiz = async () => {
        //check if all questions are correct, if so mark all corresponding LO as completed
        //otherwise notice the user needs to finish pre-requisite first
        console.log(preReqQuiz);
        console.log(preQuizRes);
        let isCorrect = true;
        for(let i in preReqQuiz){
            const res = Array.from(preQuizRes[i])[0];
            if(preReqQuiz[i].correct !== res){
                isCorrect = false;
            }
        }
        console.log(isCorrect);
        console.log(preRequisite);
        //need to find course ID，lesson ID and LO
        const courseId = course._id;
        for(let l of course.lessons){
            console.log(l);
            if(preRequisite.includes(l.LO)){
                console.log({
                    "courseId" : courseId,
                    "lessonId" : l._id,
                    "LO" : l.LO
                });
                const { data } = await axios.post(`/api/mark-completed`, {
                    courseId: course._id,
                    lessonId: l._id,
                    LO: l.LO,
                });
                console.log(data);
            }
        }
        toast("Congrats! You pass the pre-requisite test, now it's time to learn new knowledge!");
        setPreQuizOpen(false);
    }

    const handleCheckbox = (index, response, e) => {
        let result = preQuizRes;
        console.log(result);
        if(e.target.checked){
            result[index].add(response);
        }else{
            result[index].delete(response);            
        }
        console.log(result);
        setPreQuizRes(result);
    }
    return (
        <StudentRoute>
            <div className='row'>
                <div style={{ maxWidth: 400 }}>
                    <Menu
                        mode='inline'
                        style={{height: '100vh', overflow: 'scroll'}}
                        inlineCollapsed={collapsed}
                        defaultSelectedKeys={[selected]}
                    >
                    <div>
                        <Button
                            className=""
                            size="large"
                            type="primary"
                            block
                            onClick={() => handlePlanner('LO8')}
                            ><BorderOuterOutlined />Generate Your Learning Plan</Button>
                    </div>
                    <Button
                        className='text-primary mt-1 mb-2'
                        block
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined) } {!collapsed && "Lessons"}
                    </Button>
                        <hr />
                       
                        {learningPath.map((lesson, index) => (
                            <Item
                                onClick={() => handleClickLesson(index)}
                                icon={<Avatar className="text-primary" style={{backgroundColor: '#fde3cf'}}>{index + 1}</Avatar>}
                                key={index}
                            >
                                {lesson.title.substring(0, 40)} {completedLessons?.includes(lesson._id) ? (
                                    <CheckCircleOutlined className="text-primary ml-2 float-right" style={{marginTop: '15px'}}/>
                                ) : (
                                    <CloseCircleOutlined className="text-danger ml-2 float-right" style={{marginTop: '15px'}}/>
                                )}
                            </Item>
                        ))}

                    </Menu>
                </div>
                <div className='col'>
                    {selected !== -1 ? (
                        <>
                            <div className='col alert-primary alert square'>
                                <b>{course.lessons[selected].title.substring(0, 30)}</b>
                                <div className='d-flex justify-content-end'>
                                {course.lessons[selected]?.questions.length > 0 ? (
                                        <Tooltip title="Attempt Quiz">
                                            <QuestionCircleOutlined 
                                                className='me-5 text-secondary h5'
                                                onClick={() => {
                                                    setOpen(true);
                                                }}
                                            />
                                        </Tooltip>

                                    ) : (
                                        <Tooltip title="No Quiz for this Lesson">
                                            <QuestionCircleOutlined
                                                className='me-5 text-danger h5'
                                            />
                                        </Tooltip> 
                                    )}
                                </div>

                                {completedLessons?.includes(course.lessons[selected]?._id) ? (
                                    <span
                                        className='d-flex justify-content-end pointer'
                                        onClick={markIncompleted}
                                        style={{ color: 'green' }}
                                    >Mark Lesson as Incomplete</span>
                                ) : (
                                    <span
                                        className='d-flex justify-content-end pointer'
                                        onClick={markCompleted}
                                        style={{ color: 'red' }}
                                    >Mark Lesson as Complete</span>        
                                )}

                            </div>
                            {course.lessons[selected]?.video && course.lessons[selected]?.video?.Location && (
                                <>
                                    <div className='wrapper'>
                                        <ReactPlayer 
                                            className="player"
                                            width="100%"
                                            height="100%"
                                            controls
                                            url={course.lessons[selected].video.Location}
                                        />
                                    </div>
                                </>
                            )}
                            <ReactMarkdown    
                                children={course.lessons[selected].content}
                            />
                        </>
                    ) : (   
                            <div className='d-flex justify-content-center p-5'>
                                
                                <div className='text-center p-5'>
                                    <PlayCircleOutlined className='display-1 p-5 text-primary' />
                                    <p className='lead'>Please select a lesson to begin learning</p>
                                </div>
                            </div>    
                    )}
                    {course.lessons[selected]?.pdf && course.lessons[selected]?.pdf?.Location && (
                        <div className=' pb-5'>
                            <Document
                                file={course.lessons[selected].pdf.Location}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                            <div className='justify-content-center'>
                                <p>
                                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                                </p>
                                <Button
                                    type="button"
                                    disabled={pageNumber <= 1}
                                    onClick={previousPage}
                                >
                                    Previous
                                </Button>
                                <Button
                                    type="button"
                                    disabled={pageNumber >= numPages}
                                    onClick={nextPage}
                                >
                                    Next
                                </Button>
                            </div>
                
                        </div>
                     )}     
                </div>



            </div>
            <Modal
                title="Quiz"
                centered
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <form>
                    <p><b>Question:</b> {quiz[countQuiz]?.question}</p>
                    <hr />
                    <p><b>1:</b> {quiz[countQuiz]?.answer1}</p>
                    <Switch 
                        className="float-centre mt-3"
                        checked={checkAns('answer1')}
                        onChange={(e) => handleRecordAns(e, setResponse, quiz[countQuiz].answer1)}
                    />
                    <p><b>2:</b> {quiz[countQuiz]?.answer2}</p>
                    <Switch 
                        className="float-centre mt-3"
                        checked={checkAns('answer2')}
                        onChange={(e) => handleRecordAns(e, setResponse, quiz[countQuiz].answer2)}
                    />
                    <p><b>3:</b> {quiz[countQuiz]?.answer3}</p>
                    <Switch 
                        className="float-centre mt-3"
                        checked={checkAns('answer3')}
                        onChange={(e) => handleRecordAns(e, setResponse, quiz[countQuiz].answer3)}
                    />
                    <p><b>4:</b> {quiz[countQuiz]?.answer4}</p>
                    <Switch 
                        className="float-centre mt-3"
                        checked={checkAns('answer4')}
                        onChange={(e) => handleRecordAns(e, setResponse, quiz[countQuiz].answer4)}
                    />
                    <hr/>
                    {/* <Button
                        type="button"
                        onClick={(e) => handleQuiz(e)}                >
                        Start Quiz
                    </Button> */}
                    <Button
                        type="button"
                        onClick={handleSubmitQuiz}
                    >
                        Submit
                    </Button>
                </form>
            </Modal>
            <Modal
                centered
                open={endQuiz}
                okButtonProps={ { disabled: true } }
                onCancel={() => setEndQuiz(false)}
            >
                <p>Sorry! You got the wrong answer in the quiz</p>
                <hr/>
                <a href='www.google.com' onClick={() => {
                    setEndQuiz(false);
                    setPageNumber(1);
                }}><u>Click me to see more examples!</u></a>
                <br/>
                <Button type='text' onClick={() => {
                    setEndQuiz(false);
                    setPageNumber(1);
                }}><u>Click me to go back to previous slides</u></Button>
            </Modal>
            <Modal
                centered
                open={preQuizOpen}
                onOk={handleSubmitPreQuiz}
                // okButtonProps={ { disabled: true } }
                onCancel={() => setPreQuizOpen(false)}
            >
                {preReqQuiz.map((quiz, key) => {
                    return (
                        <Form key={key}>
                            <p>{quiz.question}</p>
                            <Form.Item>
                                <Checkbox onChange={(e) => handleCheckbox(key, quiz.answer1, e)}>{quiz.answer1}</Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Checkbox onChange={(e) => handleCheckbox(key, quiz.answer2, e)}>{quiz.answer2}</Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Checkbox onChange={(e) => handleCheckbox(key, quiz.answer3, e)}>{quiz.answer3}</Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Checkbox onChange={(e) => handleCheckbox(key, quiz.answer4, e)}>{quiz.answer4}</Checkbox>
                            </Form.Item>
                            <hr/>
                        </Form>
                    )
                })}
            </Modal>

        </StudentRoute>
    );
};

export default IndividualCourse;