import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../Forms/GuestInfoForm/GuestInfoForm";
const Detail = () => {
    const { hotelId } = useParams();//useParams makes it easier for us to get the stuffs out of the url

    const { data: hotel } = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId || ""), {
        enabled: !!hotelId,
    });
    if (!hotel) {
        return <></>
    }
    //First row will be having the stars and the hotelname.
    return (

        <div className="space-y-6">
            {/* // row1  */}
            <div>
                <span className="flex">
                    {Array.from({ length: hotel.starRating }).map(() => (
                        <AiFillStar className="fill-yellow-400" />
                    ))}
                </span>
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
            </div>
            {/* // The image grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {
                    hotel.imageUrls.map((image) => (
                        <div className="h-[300px]">
                            <img
                                src={image}
                                alt={hotel.name}
                                className="rounded-md w-full h-full object-cover object-center"
                            />
                        </div>
                    ))
                }
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {hotel.facilities.map((facility) => (
                    <div className="border rounded-slate-300 rounded-sm p-3">
                        {facility}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr">
                <div className="whitespace-pre-line">{hotel.description}</div>
                <div>
                    <GuestInfoForm
                        pricePerNight={hotel.pricePerNight}
                        hotelId={hotel._id}
                    />
                </div>
            </div>
        </div>
    )
}
export default Detail;