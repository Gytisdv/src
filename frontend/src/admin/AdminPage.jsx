import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminCreateForm from "./AdminCreateForm";
import AdminList from "./AdminList";
import DataContext from "../DataContext";
import axios from "axios";


// Admin page UI with view, add, edit and delete functionality
export default function AdminPage() {

    // To refresh current question data
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Main question list data
    const [questions, setQuestions] = useState(null);

    // Create table data
    const [createData, setCreateData] = useState(null);

    // Delete button click data
    const [deleteData, setDeleteData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("lastUpdate changed", lastUpdate);

        const fetchData = async () => {
            const data = await axios.get("http://localhost:3001/questions/");
            setQuestions(data.data);
        };

        fetchData().catch(console.error);
    }, [lastUpdate]);

    useEffect(() => {
        console.log("createData changed", createData);

        if (!createData)
            return;

        const backendCreate = async () => {
            await axios.post("http://localhost:3001/questions/", {
                name: createData.name,
                category: createData.category,
                description: createData.description,
            });
        };

        backendCreate()
            .then(() => setLastUpdate(Date.now()))
            .catch(console.error);
    }, [createData]);

    useEffect(() => {
        console.log("deleteData changed", deleteData);

        if (!deleteData)
            return;

        const backendDelete = async () => {
            await axios.delete(`http://localhost:3001/questions/${deleteData.id}`, {
                name: deleteData.name,
                category: deleteData.category,
                description: deleteData.description,
            });
        };  

        backendDelete()
            .then(() => setLastUpdate(Date.now()))
            .catch(console.error);
    }, [deleteData]);

    return (
        <DataContext.Provider value={{
            questions, setQuestions,
            createData, setCreateData,
            deleteData, setDeleteData,
        }}>
            <div className="container">
                <div className="text-center">
                    <button type="button" className="btn btn-primary" style={{ marginTop: "20px" }} onClick={() => navigate("/")}>Go to user page</button>
                    <button type="button" className="btn btn-secondary" style={{ marginTop: "20px", marginLeft: "10px" }} onClick={() => navigate("/logout")}>Logout</button>
                </div>
                <div className="row">
                    <div className="col-4">
                        <AdminCreateForm />
                    </div>
                    <div className="col-8">
                        <AdminList />
                    </div>
                </div>
            </div>
        </DataContext.Provider>
    );
}