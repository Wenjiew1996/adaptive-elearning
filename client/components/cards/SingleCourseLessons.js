import { Avatar, List } from "antd";
const { Item } = List;

const SingleCourseLessons = ({ setPreview, open, setOpen, lessons }) => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="col lessons-list">
                            {lessons && <h4>{lessons.length} Lessons</h4>}
                            <hr />
                            <List 
                                itemLayout="horizontal"
                                dataSource={lessons}
                                renderItem={(item, index) => (
                                    <Item>
                                        <Item.Meta title={item.title} avatar={<Avatar>{index + 1}</Avatar>}/>
                                            {item?.video && item?.video !== null && item.free_preview && (
                                            <span
                                                onClick={() => {
                                                    setPreview(item.video.Location);
                                                    setOpen(!open);
                                                }}
                                                className="text-primary pointer"    
                                            >
                                                Free Preview</span>
                                            )} 
                                        
                                    </Item>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleCourseLessons;