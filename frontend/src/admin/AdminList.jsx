import { useContext } from "react";
import DataContext from "../DataContext";
import AdminLine from "./AdminLine";

export default function AdminList() {
    const { questions } = useContext(DataContext);

    return (
        <div className="card m-4">
            <h5 className="card-header">Question List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        questions?.map(question => <AdminLine key={question.id} question={question} />)
                    }
                </ul>
            </div>
        </div>

    );
}
