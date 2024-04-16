import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];
    adultCount: number;
    childCount: number;
}
type Props = {
    hotel?: HotelType; //The hotel prop is optional here in this stage. This is because we receive a hotel only when we are on the hotel edit page. But when we are on the add hotel page we do not receive this prop.
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
}
// Since the create hotel form is quite a large form we will not be creating the entire form into one component.
//we will dividing the form into sub components. 
const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        reset(hotel);
    }, [hotel, reset]);

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
        // Create new formData object & call our api.
        // console.log(formData);
        const formData = new FormData();
        if (hotel) {
            formData.append("hotelId", hotel._id);//If we are having hotel the prop that means we are on the edit page. and we need to know the hotelId of the hotel that we are editing
        }
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("pricePerNight", formDataJson.pricePerNight.toString());
        formData.append("starRating", formDataJson.starRating.toString());
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());

        // Now we need to do the complicated work. Append the facilities using the foreach loop
        formDataJson.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });

        // Now we need to save the image urls on the backend.
        //[image1.jpg,image2.jpg,image3.jpg]
        //imageUrls = [image1.jpg]. This will override the older image array in the backend
        if (formDataJson.imageUrls) {
            formDataJson.imageUrls.forEach((url, index) => {
                formData.append(`imageUrls[${index}]`, url);
            });
        }
        //For the images. We cannot directly use the foreach since we are working with image files and binary data. Also the filelist type does not let us use the for
        //each things. So we have create out own for each thing.
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });
        
        onSave(formData);
    });
    return (
    <FormProvider {...formMethods}>
        <form className="flex flex-col gap-10" onSubmit={onSubmit}>
            <DetailsSection />
            <TypeSection />
            <FacilitiesSection />
            <GuestsSection />
            <ImagesSection />
            <span className="flex justify-end">
                <button 
                disabled={isLoading} 
                type="submit" 
                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                >
                    {isLoading ? "Saving..." : "Save"}
                </button>
            </span>
        </form>
        </FormProvider>
        );
}
export default ManageHotelForm;