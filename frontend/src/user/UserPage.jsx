import { useEffect, useState } from "react";

import UserList from "./UserList";
import DataContext from "../DataContext";
import axios from "axios";

import { useNavigate } from "react-router-dom";

// User page UI with view, like and dislike functionality
export default function UserPage() {

    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Main question list data
    const [questions, setQuestions] = useState([]);

    const [filteredQuestions, setFilteredQuestions] = useState([]);

    // Like button click data
    const [likeData, setLikeData] = useState(null);

    // Dislike button click data
    const [dislikeData, setDislikeData] = useState(null);

    // Answering data (id and answer)
    const [answerData, setAnswerData] = useState(null);

    const [searchText, setSearchText] = useState("");

    const fetchDataWrapped = () => {
        const fetchData = async () => {
            const data = await axios.get("http://localhost:3001/questions/");
            setQuestions(data.data);
        };

        fetchData().catch(console.error);
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetchDataWrapped();
    }, [lastUpdate]);

    // Fetch data first time from the start and on like/dislike
    useEffect(() => {
        console.log("Loading initial question list for user");
        fetchDataWrapped();
    }, [likeData, dislikeData]);

    // Fetch data after a timer after that
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("question refresh time interval has passed for user");
            fetchDataWrapped();
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log("likeData changed", likeData);

        if (!likeData)
            return;

        const backendLike = async () => {
            await axios.post(`http://localhost:3001/questions/${likeData.id}/like`);
        };

        backendLike()
            .then(() => setLikeData(null)) // Reset to null to allow click like again
            .catch(console.error);

    }, [likeData]);

    useEffect(() => {
        console.log("dislikeData changed", dislikeData);

        if (!dislikeData)
            return;

        const backendDislike = async () => {
            await axios.post(`http://localhost:3001/questions/${dislikeData.id}/dislike`);
        };

        backendDislike()
            .then(() => setDislikeData(null)) // Reset to null to allow click dislike again
            .catch(console.error);
    }, [dislikeData]);

    useEffect(() => {
        console.log("answerData changed", answerData);

        if (!answerData)
            return;

        const backendAnswer = async () => {
            await axios.post(`http://localhost:3001/questions/${answerData.id}/answer`, {
                answer: answerData.answer,
            });
        };

        backendAnswer()
            .then(() => setLastUpdate(Date.now()))
            .catch(console.error);
    }, [answerData]);

    useEffect(() => {
        const newFilteredQuestions = questions.filter(question => {
            // console.log("filtering question", question);
            const lowerCaseSearchText = searchText.toLowerCase();

            if (question.name.toLowerCase().includes(lowerCaseSearchText))
                return true;
            
            if (question.category.toLowerCase().includes(lowerCaseSearchText))
                return true;

            if (question.description.toLowerCase().includes(lowerCaseSearchText))
                return true;

            return false;
        });

        setFilteredQuestions(newFilteredQuestions);

    }, [searchText, questions])

    return (
        <DataContext.Provider value={{
            filteredQuestions,
            setLikeData,
            setDislikeData,
            setAnswerData,
        }}>
            <div className="container">
                <div className="text-center">
                    <button type="button" className="btn btn-primary" style={{ marginTop: "20px" }} onClick={() => navigate("/admin")}>Go to admin page</button>
                </div>
                <div className="input-group rounded" style={{ paddingTop: "20px" }}>
                    <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon"
                        value={searchText} onChange={e => setSearchText(e.target.value)} />
                </div>
                <div className="row">
                    <div className="col-12">
                        <UserList />
                    </div>
                </div>
            </div>
        </DataContext.Provider>
    );
}