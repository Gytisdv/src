import { useState, useContext } from "react";
import DataContext from "../DataContext";

export default function AdminCreateForm() {
    const availableCategory = [
        "Nusiskundimai",
        "Informaciniai",
        "Belenkas",
    ];

    const [name, setName] = useState("");
    const [category, setCategory] = useState(availableCategory[0]);
    const [description, setDescription] = useState("");

    const { setCreateData } = useContext(DataContext);

    const onAddClick = () => {
        setCreateData({ name, category, description });
        setName("");
        setCategory(availableCategory[0]);
        setDescription("");
    };
    
    return (
        <div className="card m-4">
            <h5 className="card-header">New question</h5>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value={0} disabled>Choose from list</option>
                        {
                            availableCategory.map(category => <option key={category} value={category}>{category}</option>)
                        }
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <button onClick={onAddClick} type="button" className="btn btn-outline-success">Add</button>
            </div>
        </div>
    );
}
