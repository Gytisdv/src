import { useContext } from "react";
import DataContext from "../DataContext";
import { useEffect, useState } from "react";

export default function UserLine({ question }) {

    const { setLikeData, setDislikeData, setAnswerData } = useContext(DataContext);

    const [answerInputData, setAnswerInputData] = useState(null);

    return (
        <li className="list-group-item">
            <div className="question">
                <div className="question__content">
                    <div className="question__content__name">
                        {question.name}
                    </div>
                    <div className="question__content__genre">
                        {question.category}
                    </div>
                    <div className="question__content__year">
                        {question.description}
                    </div>
                </div>
                <div className="question__buttons">
                    <div className="question__content__year">
                        Likes: {question.likes}
                    </div>
                    <button onClick={() => setLikeData(question)} type="button" className="btn btn-outline-success">Like</button>
                    <button onClick={() => setDislikeData(question)} type="button" className="btn btn-outline-danger">Dislike</button>
                </div>
            </div>
            {question.answer
                ?
                <div>
                    Answer: {question.answer}
                </div>
                :
                <div class="input-group mb-3 card-body">
                    <input type="text" class="form-control" placeholder="Answer" aria-label="Answer" aria-describedby="basic-addon2" value={answerInputData} onChange={e => setAnswerInputData(e.target.value)}/>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" onClick={() => setAnswerData({ id: question.id, answer: answerInputData })}>Submit</button>
                    </div>
                </div>
            }

        </li>
    )
}
