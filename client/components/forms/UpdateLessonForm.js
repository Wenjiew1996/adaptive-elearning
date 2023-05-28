import ReactPlayer from 'react-player';
import { Button, Switch, Progress } from "antd";

const UpdateLessonForm = ({
    current,
    setCurrent,
    handleUpdateLesson,
    handleVideo,
    uploadVideoButtonDesc,
    progressBar,
    uploading,
    pdfText,
    progressBarPdf,
    handlePdf,
}) => {
    return <div className="container pt-1">
        <form onSubmit={handleUpdateLesson}>
            <input
                type="text" 
                className="form-control square"
                onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                value={current.title}
                autoFocus
                required
            />
            <textarea
                className="form-control mt-4"
                cols="7"
                rows="7"
                onChange={e => setCurrent({ ...current, content: e.target.value })}
                value={current.content}
            />
            <div className="d-grid gap-2">
                
                {!uploading && current.video && current.video?.Location && (
                    <div className="d-flex justify-content-center pt-2">
                        <ReactPlayer
                            width="400px"
                            height="240px"
                            url={current.video.Location}
                            controls       
                        ></ReactPlayer>
                    </div>
                )}
                <label className="btn btn-block btn-secondary text-left mt-4">
                    {uploadVideoButtonDesc}
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideo}
                        hidden     
                    />
                </label>

                {progressBar > 0 && (
                    <Progress
                        className="d-flex justify-content-center pt-2"
                        percent={progressBar}
                        steps={10}     
                    />
                )}
            </div>
            {/* Adding PDF */}
            <div className="d-grid gap-2">
                <label className="btn btn-block btn-dark text-left mt-4">
                    {pdfText}
                    <input
                        type="file"
                        onChange={handlePdf}
                        hidden     
                    />
                </label>

                {progressBarPdf > 0 && (
                    <Progress
                        className="d-flex justify-content-center pt-2"
                        percent={progressBarPdf}
                        steps={10}     
                    />
                )}
            </div>

            <div className="d-flex justify-content-between pt-1">
                <span className="badge pt-4" style={{ color: 'green' }}>Preview</span>
                <Switch 
                    className="float-right mt-3"
                    disabled={uploading}
                    checked={current.free_preview}   // In the DB schema
                    onChange={(p) => setCurrent({...current, free_preview: p})}
                    name="Free-Preview"
                />
            </div>

            <div className="d-grid gap-2">
                <Button
                    className="col mt-4"
                    size="large"
                    type="primary"
                    onClick={handleUpdateLesson}
                    loading={uploading}
                    shape="round"
                >Save Lesson</Button>
            </div>
        </form>
    </div>;
};

export default UpdateLessonForm;