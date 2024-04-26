// Here we are going to store the user search criteria that the user filled into the search criteria.
//This will used at quite a lot of places in the project.

import React, { useContext, useState } from "react";

type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId: string,
    saveSearchValues: (destination: string, checkIn: Date, checkOut: Date, adultCount: number, childCount: number)
        => void
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);
type SearchContextProviderProps = {
    children: React.ReactNode;
}
export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
    const [destination, setDestination] = useState<string>("");
    const [checkIn, setCheckIn] = useState<Date>(new Date());
    const [checkOut, setCheckout] = useState<Date>(new Date());
    const [adultCount, setAdultCount] = useState<number>(1);
    const [childCount, setChildCount] = useState<number>(0);
    const [hotelId, setHotelId] = useState<string>("")

    const saveSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        hotelId?: string
    ) => {
        //Update the state values.
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckout(checkOut)
        setAdultCount(adultCount);
        setChildCount(childCount);
        if (hotelId) {
            setHotelId(hotelId);
        }
    };
    return (
        <SearchContext.Provider value={{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount,
            hotelId,
            saveSearchValues
        }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext;
}