import AddHotelForm from "./components/AddHotelForm";
import HotelList from "./components/HotelList";
import React from "react";

import Keycloak from "keycloak-js";

let initOptions = {
    url: "http://localhost:8080/",
    realm: "master",
    clientId: "app-client",
};

let kc = new Keycloak(initOptions);

kc.init({
    onLoad: "login-required",
    checkLoginIframe: true,
}).then((authenticated) => {
    if (authenticated) {
        console.log("User is authenticated");
        console.log("auth", authenticated);
        console.log("kc", kc);
        console.log("token", kc.token);

        // httpClient.defaults.headers.common["Authorization"] =
        // "Bearer " + kc.token;

        kc.onTokenExpired = () => {
            console.log("token expired");
        };
    } else {
        console.log("User is not authenticated");
        window.location.reload();
    }
});

function App() {
    return (
        <div className="App">
            <h1>Hotel Management</h1>
            <AddHotelForm />
            <HotelList />

            <button
                onClick={() =>
                    kc.logout({ redirectUri: "http://localhost:3000/" })
                }
            >
                Logout
            </button>
        </div>
    );
}

export default App;
