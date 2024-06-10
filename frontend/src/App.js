import React, { useState, useEffect } from "react";
import AddHotelForm from "./components/AddHotelForm";
import HotelList from "./components/HotelList";
import Keycloak from "keycloak-js";

const initOptions = {
    url: "http://localhost:8080/",
    realm: "vot",
    clientId: "app-client",
};

const kc = new Keycloak(initOptions);

console.log("kc", kc);

const initializeKeycloak = async () => {
    const authenticated = await kc.init({
        onLoad: "login-required",
        checkLoginIframe: true,
    });

    if (authenticated) {
        console.log("User is authenticated");
        console.log("auth", authenticated);
        console.log("kc", kc);
        console.log("token", kc.token);

        localStorage.setItem("token", kc.token);
        localStorage.setItem("refreshToken", kc.refreshToken);

        kc.onTokenExpired = () => {
            console.log("token expired");
        };

        return true;
    } else {
        console.log("User is not authenticated");
        window.location.reload();
    }

    return false;
};

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [kcInitialized, setKcInitialized] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            if (!kcInitialized) {
                const auth = await initializeKeycloak();
                setAuthenticated(auth);
                setKcInitialized(true);
                setLoading(false);
            }
        };

        initAuth();
    }, [kcInitialized]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (authenticated) {
        localStorage.setItem("token", kc.token);
        localStorage.setItem("refreshToken", kc.refreshToken);
    }

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
