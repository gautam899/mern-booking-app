import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";

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
    adultCount: number;
    childCount: number;
}
type Props = {
    onSave: (hotelFormData: FormData) => void
    isLoading: boolean
}
// Since the create hotel form is quite a large form we will not be creating the entire form into one component.
//we will dividing the form into sub components. 
const ManageHotelForm = ({ onSave, isLoading }: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit } = formMethods;

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
        // Create new formData object & call our api.
        // console.log(formData);
        const formData = new FormData();
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
            formData.append(`facilities[${index}]`, facility)
        })
        //For the images. We cannot directly use the foreach since we are working with image files and binary data. Also the filelist type does not let us use the for
        //each things. So we have create out own for each thing.
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        })

        onSave(formData)
    });
    return <FormProvider {...formMethods}>
        <form className="flex flex-col gap-10" onSubmit={onSubmit}>
            <DetailsSection />
            <TypeSection />
            <FacilitiesSection />
            <GuestSection />
            <ImagesSection />
            <span className="flex justify-end">
                <button disabled={isLoading} type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500">{isLoading ? "Saving..." : "Save"}</button>
            </span>
        </form></FormProvider>
}
export default ManageHotelForm;