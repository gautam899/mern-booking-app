import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../Forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
const EditHotel = () => {
    // We can use a hook from the react router dom
    const { hotelId } = useParams();
    const { showToast } = useAppContext();
    const { data: hotel } = useQuery("fetchMyHotelById", 
    () => apiClient.fetchMyHotelById(hotelId || ""), 
    {
        enabled: !!hotelId, // Only run the query if hotelId is not undefined
    }
        // Now useQuery expects a valid string and but the hotelId could be undefined. That problem can be solved using the double exclamation marks.
        // The above expression is one of the cons of typescript and we can solve it using the double exclamation mark which is a atrophy mark.
    );
    // Mutation in react are used to modify the state of the application.
    const {mutate,isLoading} = useMutation(apiClient.updateMyHotelById,{
        onSuccess:()=>{
            showToast({ message: "Hotel Saved!", type: "SUCCESS" });
        },
        onError:()=>{
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
        }
    })
    // Now we need to specify a function that we need to call when we submit the form. At this stage the code isvery much similar to the code for the add hotel. There
    // also we are specifying a 
    const handleSave = (hotelFormData:FormData)=>{
        mutate(hotelFormData);
    }
    return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
}
export default EditHotel;