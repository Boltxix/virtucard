import axios from "axios";
import { createContext, useEffect, useState } from "react";

//Create a new context object
export const AuthContext = createContext()

// Define a new component that provides the AuthContext to its child components
export const AuthContexProvider = ({ children }) => {
    // Initialize a state variable called currentUser using the value stored in the browser's localStorage or null if there is no value
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null)

    // Define a function that makes an HTTP request to authenticate the user and update the currentUser state variable 
    const login = async (inputs) => {
        const res = await axios.post("/auth/login", inputs);
        setCurrentUser(res.data);
    }

    // Define a function that makes an HTTP request to log out the user and update the currentUser state variable 
    const logout = async (inputs) => {
        await axios.post("/auth/logout");
        setCurrentUser(null);
    };
    // Use the useEffect hook to update the localStorage value whenever the currentUser state variable changes
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    // Render the child components and pass them the currentUser state variable, the setCurrentUser function, and the login and logout functions as properties of the AuthContext
    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

