import React, { useEffect, useState } from "react";
import axios from "axios";

const HotelList = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/hotels")
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
