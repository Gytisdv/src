import { useContext } from "react";
import DataContext from "../DataContext";
import UserLine from "./UserLine";

export default function UserList() {
    const { filteredQuestions } = useContext(DataContext);

    return (
        <div className="card m-4">
            <h5 className="card-header">Questions List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        filteredQuestions?.map(question => <UserLine key={question.id} question={question} />)
                    }
                </ul>
            </div>
        </div>

    );
}
