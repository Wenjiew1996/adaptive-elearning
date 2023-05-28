import { Modal } from "antd";
import ReactPlayer from 'react-player';


const PreviewModal = ({open, setOpen, preview}) => {

    return (
        <>
            <Modal
                title='Preview of Course'
                visible={open}
                onCancel={() => setOpen(!open)}
                destroyOnClose={true}
                width={760}
                footer={null}
            >
                <div className="wrapper">
                    <ReactPlayer
                        url={preview}
                        controls={true}
                        playing={open}
                        width="100%"
                        height="100%"
                    />
                </div>
            </Modal>
        </>
    );
};

export default PreviewModal;