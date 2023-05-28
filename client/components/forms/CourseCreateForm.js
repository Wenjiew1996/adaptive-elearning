import { Select, Button, Avatar, Badge } from "antd";

const { Option } = Select;

const CreateCourseForm = ({
    handleSubmit,
    handleImage,
    handleChange,
    values,
    preview,
    uploadButtonDesc,
    handleImageRemove = (i) => i,
    editPage = false
}) => {
    return (
        <>
            {values && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Name"
                            value={values.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group pt-3">
                        <textarea
                            name="description"
                            cols="7"
                            rows="7"
                            value={values.description}
                            className="form-control"
                            placeholder="Brief description of course"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-group pt-3">
                        <input
                            type="text"
                            name="category"
                            className="form-control"
                            placeholder="Category"
                            value={values.category}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row pt-3">
                        <div className="col">
                            <div className="form-group">
                                <label className="btn btn-outline-secondary btn-block text-left">
                                    {uploadButtonDesc}
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleImage}
                                        accept="image/*"
                                        hidden
                                    />
                                </label>
                                {preview && (
                                    <Badge count="X" onClick={handleImageRemove} className="pointer">
                                        <Avatar width={300} src={preview} />
                                    </Badge>
                                )}

                                {editPage && values?.image && (<Avatar width={300} src={values.image.Location} />)}
                            </div>
                        </div>
                    </div>

                    <div className="row pt-3">
                        <div className="col">
                            <Button
                                onClick={handleSubmit}
                                disabled={values.loading || values.uploading}
                                className="btn btn-primary"
                                loading={values.loading}
                                type="primary"
                                size="large"
                                shape="round"
                            >
                                {values.loading ? "Saving..." : "Save & Continue"}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default CreateCourseForm;