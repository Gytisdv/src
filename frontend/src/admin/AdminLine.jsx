import { useContext } from "react";
import DataContext from "../DataContext";

export default function AdminLine({ question }) {

    const { setDeleteData } = useContext(DataContext);

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
                    <button onClick={() => setDeleteData(question)} type="button" className="btn btn-outline-danger">Delete</button>
                </div>
            </div>
        </li>
    )
}
