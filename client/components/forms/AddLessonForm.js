import { Button, Tooltip, Progress } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

const AddLessonForm = ({
    values,
    setValues,
    handleAddLesson,
    uploading,
    videoText,
    handleVideoUpload,
    progressBar,
    handleVideoRemove,
    pdfText,
    handlePdfUpload,
    uploadingPdf,
    progressBarPdf,
    handlePdfRemove,
}) => {
    return <div className="container pt-1">
        <form onSubmit={handleAddLesson}>
            <input
                type="text" 
                className="form-control square"
                onChange={(e) => setValues({ ...values, title: e.target.value })}
                value={values.title}
                placeholder="Title"
                autoFocus
                required
            />
            <textarea
                className="form-control mt-4"
                cols="7"
                rows="7"
                onChange={e => setValues({ ...values, content: e.target.value })}
                value={values.content}
                placeholder="Content"
            />
            <hr/>
            <h5 className="mt-4">Planning Fields</h5>
            <input
                type="text" 
                className="form-control square mt-4"
                onChange={(e) => setValues({ ...values, LO: e.target.value })}
                value={values.LO}
                placeholder="Learning Object: LOXX"
                autoFocus
                required
            />
            <input
                type="text" 
                className="form-control square mt-4"
                onChange={(e) => setValues({ ...values, preconditions: e.target.value })}
                value={values.preconditions}
                placeholder="Preconditions: LO1, LO2, LO3 ..."
                autoFocus
                required
            />
            <div className="d-grid gap-2">
                <label className="btn btn-block btn-secondary text-left mt-4">
                    {videoText}
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        hidden     
                    />
                </label>
                
                {!uploading && values.video?.Location && (
                    <Tooltip title="Remove Video">
                        <span onClick={handleVideoRemove} className="pt-1 pl-3">
                            <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
                        </span>
                    </Tooltip>
                )}

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
                        onChange={handlePdfUpload}
                        hidden     
                    />
                </label>
                
                {!uploadingPdf && values.pdf?.Location && (
                    <Tooltip title="Remove PDF">
                        <span onClick={handlePdfRemove} className="pt-1 pl-3">
                            <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
                        </span>
                    </Tooltip>
                )}

                {progressBarPdf > 0 && (
                    <Progress
                        className="d-flex justify-content-center pt-2"
                        percent={progressBarPdf}
                        steps={10}     
                    />
                )}
            </div>
            <div className="d-grid gap-2">
                <Button
                    className="col mt-4"
                    size="large"
                    type="primary"
                    onClick={handleAddLesson}
                    loading={uploading}
                    shape="round"
                >Save Lesson</Button>
            </div>
        </form>
    </div>;
};

export default AddLessonForm;