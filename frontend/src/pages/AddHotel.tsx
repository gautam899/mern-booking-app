import { useMutation } from "react-query";
import ManageHotelForm from "../Forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
const AddHotels = ()=>{
    const {showToast} = useAppContext();
    // now we need to create a api fetch request using the useMutation.
    const {mutate,isLoading} = useMutation(apiClient.addMyHotel,{
        onSuccess:()=>{
            showToast({message:"Hotel Saved!",type:"SUCCESS"});
        },
        onError:()=>{
            showToast({message:"Error Saving Hotel", type:"ERROR"});
        },
    });
    const handleSave = (hotelFormData:FormData)=>{
        mutate(hotelFormData);
    }
    return (<ManageHotelForm onSave={handleSave} isLoading={isLoading}/>); //The reason why we are using the  ManageHotelForm component is because it makes the code reusable when it comes to edit the hotel page. Also we can have the create and edit the hotel page into the same component.
}

export default AddHotels;