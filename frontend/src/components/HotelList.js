import React, { useEffect, useState } from "react";
import axios from "axios";

const HotelList = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        axios
            .get(`${backendUrl}/hotels`, {
                headers: {
                    Authorization: "Bearer " + token,
                    refresh_token: refreshToken,
                },
            })
            .then((response) => {
                setHotels(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    return (
        <div>
            <h2>Hotels</h2>
            <ul>
                {hotels.map((hotel) => (
                    <li key={hotel.id}>
                        {hotel.name} - {hotel.location}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HotelList;
