import React, { useState } from "react";
import axios from "axios";

const AddHotelForm = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        axios
            .post(
                "http://localhost:5000/hotels",
                {
                    name: name,
                    location: location,
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        refresh_token: refreshToken,
                    },
                }
            )
            .then((response) => {
                console.log("Hotel added successfully");
                setName("");
                setLocation("");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error adding hotel: ", error);
            });
    };

    return (
        <div>
            <h2>Add Hotel</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Hotel</button>
            </form>
        </div>
    );
};

export default AddHotelForm;
