import { apiGet } from "./axiosRequest"
import { Iartist } from "../models/Artists" 


interface FetchArtistDetailsParams {
    artistId: string;
}

interface FetchArtistDetailsResponse {
    success: boolean;
    message: string;
    data?: Iartist;
}

export const fetchArtistDetails = async ({ artistId }: FetchArtistDetailsParams): Promise<FetchArtistDetailsResponse> => {
    try {
        const response = await apiGet<FetchArtistDetailsResponse>(`/api/artist/getArtistDetails?artistId=${artistId}`);
        console.log("response arts");
        console.log(response);
        
        if (response && response.success) {
            return {
                success: true,
                message: "Success",
                data: response.data as Iartist
            }
        } else {
            return {
                success: false,
                message: "No Artist Found"
            }
        }
    } catch (error) {
        // Ensure error is of type Error
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {
            success: false,
            message: errorMessage
        }
    }
}
