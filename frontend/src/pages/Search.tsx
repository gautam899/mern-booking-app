import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import Pagination from "../components/Pagination";
import SearchResultCard from "../components/SearchResultsCard";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOptions] = useState<string>("");
    // The below are the search paramater.
    const searchParams =
    {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption,
    };
    const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
        apiClient.searchHotels(searchParams)
    )
    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;//1,2,3,4 or 5
        // Now we need to set the state accordingly depending upon whether the user has checked or unchecked
        // the stars. If a new star is clicked then we add it to the new star rating. Else if a star is unchecked then we 
        //We will filter the stars by excluding all the unchecked stars and then updating it into the state.
        setSelectedStars((prevStars) =>
            event.target.checked
                ? [...prevStars, starRating]
                : prevStars.filter((star) => star !== starRating)
        );
    };
    const handleHotelTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const hotelType = event.target.value;
        setSelectedHotelTypes((prevHotelTypes) =>
            event.target.checked
                ? [...prevHotelTypes, hotelType]
                : prevHotelTypes.filter((hotel) => hotel !== hotelType)
        );
    };
    // Now we need the setSelected hotelType Change. 
    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelFacility = event.target.value;//1,2,3,4 or 5
        // Now we need to set the state accordingly depending upon whether the user has checked or unchecked
        // the stars. If a new star is clicked then we add it to the new star rating. Else if a star is unchecked then we 
        //We will filter the stars by excluding all the unchecked stars and then updating it into the state.
        setSelectedFacilities((prevFacilities) =>
            event.target.checked
                ? [...prevFacilities, hotelFacility]
                : prevFacilities.filter((facility) => facility !== hotelFacility)
        );
    };
    return (
        // In side we are having two column layout where on the left we will have the filter by price etc and on the right column we will have hotel card.
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            {/* The div of the filter */}
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        Filter By:
                    </h3>
                    {/* Here we will further add the filters. */}
                    <StarRatingFilter
                        selectedStars={selectedStars}
                        onChange={handleStarsChange}
                    />
                    <HotelTypesFilter
                        selectedHotelTypes={selectedHotelTypes}
                        onChange={handleHotelTypeChange}
                    />
                    <FacilitiesFilter
                        selectedFacilities={selectedFacilities}
                        onChange={handleFacilityChange}
                    />
                    <PriceFilter
                        selectedPrice={selectedPrice}
                        onChange={(value?: number) => setSelectedPrice(value)}
                    />
                </div>
            </div>

            {/* The hotel cards */}
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    {/* TODO sort options */}
                    <select
                        value={sortOption}
                        onChange={(event) => setSortOptions(event.target.value)}
                        className="p-2 border rounded-md"
                    >
                        {/* HEre we will have a number of options   */}
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (low to high)</option>
                        <option value="pricePerNightDesc">Price Per Night (high to low)</option>
                    </select>

                </div>
                {hotelData?.data.map((hotel) => (
                    <SearchResultCard hotel={hotel} />
                ))}
                <div>
                    <Pagination
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 1}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </div>
        </div>
        );
};
export default Search;