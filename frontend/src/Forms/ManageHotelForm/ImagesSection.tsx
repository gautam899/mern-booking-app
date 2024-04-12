import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
    const { register, formState: { errors } } = useFormContext<HotelFormData>();
    return (
        <div>
            <h2 className="text-3xl font-bold mb-3">Images</h2>
            {/* Div to wrap our images. */}
            <div className="border rounder p-4 flex flex-col gap-4">
                <input type="file" 
                    multiple
                    accept="image/*"
                    className="w-full text-gray-700 font-normal"
                {...register("imageFiles", {
                    validate: (imageFiles) => {
                        const totalLength = imageFiles.length;
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