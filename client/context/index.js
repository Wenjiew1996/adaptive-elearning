import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Creating a redox like state management system using a reducer and context hook
// A global state with context api and reducer hook

// Initial state
const initialState = {
    user: null,
};

// Create context
const Context = createContext();

// Create root reducer function (updates the state with the user information in the action)
const rootReducer = (state, action) => {
    switch (action.type) {         // action.type are strings representing the event + the payload (user info)
        case "LOGIN":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        default:
            return state;
    }
};

// Context provider used to wrap the _app. Everything in the app is received as children. 
// So entire application has access to the context
const Provider = ({ children }) => {
    // not 'setState' as with regular react. Use dispatch with reducer
    const [state, dispatch] = useReducer(rootReducer, initialState); 
    
    const router = useRouter();

    // Preserves user context on refresh by retrieving from local storage
    useEffect(() => {
        dispatch({
            type: "LOGIN",
            payload: JSON.parse(window.localStorage.getItem("user")),
        });
    }, []);

    // Check token expiration, akin to middleware for express
    axios.interceptors.response.use(
        function (response) {
            return response;    // all successful 2XX status codes    
        },
        function (error) {
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                return new Promise((resolve, reject) => {
                    axios.get("/api/logout").then((data) => {
                        console.log("/401 error - logout");
                        dispatch({ type: "LOGOUT" });
                        window.localStorage.removeItem("user");
                        router.push("/login");
                    }).catch((err) => {
                        console.log("AXIOS INTERCEPTORS ERROR", err);
                        reject(error);
                    });
                });               
            }
            return Promise.reject(error);
        }
    );
    
    // Ensure the CSRF token is includer in the headers each time an axios request is made
    useEffect(() => {
        const getCsrfToken = async () => {
            const { data } = await axios.get("/api/csrf-token");
            axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
        };
        getCsrfToken();
    }, []);
    
    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    );
};

export { Context, Provider };