
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { ArtistDataTable } from "./components/ArtistDataTable";
import { api } from "@/lib/apiRequest";
import NewArtistButton from "./components/NewArtistButton";

interface Artist {
  _id: string;
  labelId: string;
  artistName: string;
  iprs: boolean;
  iprsNumber: string;
  isComposer: boolean;
  isLyricist: boolean;
  isProducer: boolean;
  isSinger: boolean;
}

interface ArtistsResponse {
  success: boolean;
  data: Artist[];
  message?: string;
}

export const dynamic = 'force-dynamic';

const ArtistPage = async () => {
  // Use safe API method with fallback data for static generation
  const response = await api.safeGet<ArtistsResponse>(
    "/api/artist/getAllArtist",
    { success: true, data: [] },
    { cache: 'no-store' }
  );
  const artists = response.data || [];

  return (
    <div
      className="w-full h-full p-6 bg-white rounded-sm"
      style={{ minHeight: "90vh" }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Artists</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 text-blue-500">All Artists</h3>
        {/* <Button onClick={() => setIsModalVisible(true)}>New Artist</Button> */}
        <NewArtistButton />
      </div>

      <ArtistDataTable data={artists} />

      {/* <ArtistModalForm isVisible={isModalVisible} onClose={handleClose} /> */}
    </div>
  );
};

export default ArtistPage;
