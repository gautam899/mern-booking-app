// This file will contain all the tools and properties that we will
//expose to our components like the toast and notifications. The properties that that we will define here will be common to our entire app.

import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

// Wheneve out components will call the showToast they will have to pass the 
// objects which will contain the mesaage and the type.
type AppContext = {
    showToast: (tostMessage: ToastMessage) => void;
    isLoggedIn: boolean;
}

const AppContext = React.createContext<AppContext | undefined>(undefined);
//So whenever the loads for the first time the Appcontext is going to be undefined.

// App context provider can be seen as something that can hold states and hooks and perform that kind of stuff.
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    // The below piece of code is going to call the validate tokne endpoint using the apiCLient and see if it return a 401, If it return a 401 then we return a error.
    const {isError} = useQuery("validateToken",apiClient.validateToken,{
        retry:false,
    });
    
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                // Setting the values into the state that means our toast state variable has value and when it has the value the message gets rendered/
                setToast(toastMessage);
            },
            isLoggedIn:!isError
        }}
        >
            {toast &&
                (<Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)} />)}
            {/* Once the timer run out we update the state setToast to undefined and that will result in a re-render */}
            {children}
        </AppContext.Provider>
    )
}

// Now let's create the hook that let's our react component easily access the provider.
export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}
// Now if any component wants to use the app context they can import the hook quite easily.
