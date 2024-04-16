import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
    const { register, formState: { errors } ,watch,setValue} = useFormContext<HotelFormData>();

    const existingImageUrls = watch("imageUrls"); //This functiality will be used inside the 
    const handleDelete = (event:React.MouseEvent<HTMLButtonElement,MouseEvent>,imageUrl:string)=>{
        event.preventDefault(); //TO prevent the default action of submitting the form which happens
        setValue("imageUrls",existingImageUrls.filter((url)=>url!==imageUrl))
    }
    // Whenever the button is clicked then handle delete is called and we filter the image urls to remove that particular url
    return (
        <div>
            <h2 className="text-3xl font-bold mb-3">Images</h2>
            {/* Div to wrap our images. */}
            <div className="border rounder p-4 flex flex-col gap-4">
                {existingImageUrls && (
                    <div className="grid grid-cols-6 gap-4">
                        {existingImageUrls.map((url)=>(
                            <div className="relative group">
                                <img src={url} className="min-h-full object-cover" />
                                <button 
                                onClick={(event)=>handleDelete(event,url)}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">Delete</button>
                            </div>
                        ))}
                    </div>
                )}
                <input type="file" 
                    multiple
                    accept="image/*"
                    className="w-full text-gray-700 font-normal"
                {...register("imageFiles", {
                    validate: (imageFiles) => {
                        const totalLength = imageFiles.length+(existingImageUrls?.length || 0);

                        if (totalLength === 0) {
                            return "Atleast one image need to be added";
                        }
                        if (totalLength > 6) {
                            return "No more than 6 images";
                        }
                        return true;
                    }
                })} />
            </div>
            {errors.imageFiles && (
                <span className="text-red-500 text-sm font-bold">{errors.imageFiles.message}</span>
            )}
        </div>
    )

}
export default ImagesSection;