import { Button, Switch } from "antd";

const AddQuizForm = ({
    current,
    setCurrent,
    handleAddQuiz,
    uploading,
}) => {
    return <div className="container pt-1">
        <form onSubmit={handleAddQuiz}>
            
            <textarea
                className="form-control"
                cols="7"
                rows="7"
                onChange={e => setCurrent({ ...current, question: e.target.value })}
                value={current.question}
                placeholder="Enter Question"
            />

            <input
                type="text" 
                className="form-control square  mt-4"
                onChange={(e) => setCurrent({ ...current, answer_1: e.target.value })}
                value={current.answer_1}
                autoFocus
                required
                placeholder="Answer 1"
            />

            <Switch 
                className="float-centre mt-3"
                onChange={(p) => setCurrent({...current, response_1: p})}
            />
                
            <input
                type="text" 
                className="form-control square  mt-4"
                onChange={(e) => setCurrent({ ...current, answer_2: e.target.value })}
                value={current.answer_2}
                autoFocus
                required
                placeholder="Answer 2"
                />
            <Switch 
                className="float-centre mt-3"
                onChange={(p) => setCurrent({...current, response_2: p})}
            />
            <input
                type="text" 
                className="form-control square  mt-4"
                onChange={(e) => setCurrent({ ...current, answer_3: e.target.value })}
                value={current.answer_3}
                autoFocus
                required
                placeholder="Answer 3"
            />
            <Switch 
                className="float-centre mt-3"
                onChange={(p) => setCurrent({...current, response_3: p})}
            />
            <input
                type="text" 
                className="form-control square  mt-4"
                onChange={(e) => setCurrent({ ...current, answer_4: e.target.value })}
                value={current.answer_4}
                autoFocus
                required
                placeholder="Answer 4"
            />
            <Switch 
                className="float-centre mt-3"
                onChange={(p) => setCurrent({...current, response_4: p})}
            />
            <div className="d-grid gap-2">
                <Button
                    className="col mt-4"
                    size="large"
                    type="primary"
                    onClick={handleAddQuiz}
                    loading={uploading}
                    shape="round"
                >Save Question</Button>
            </div>
        </form>
    </div>;
};

export default AddQuizForm;