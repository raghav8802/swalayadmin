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
        const response = await apiGet(`/api/artist/getArtistDetails?artistId=${artistId}`);
        console.log("response arts");
        console.log(response);
        
        if (response.success) {
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
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}
