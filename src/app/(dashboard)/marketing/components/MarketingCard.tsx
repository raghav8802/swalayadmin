import React from "react";
import Style from "../../../styles/NewReleaseItem.module.css";
import Link from "next/link";
import Image from "next/image";

interface NewReleaseItemProps {
  imageSrc: string;
  albumName: string;
  albumArtist: string;
  albumId: string;
  status: string; 
}


const MarketingCard: React.FC<NewReleaseItemProps> = ({
  imageSrc,
  albumName,
  albumArtist,
  albumId,
  status,
}) => {

  let label = "Unknown";
  let color = "yellow"; // Default values

  switch (status) {
    case "Pitched":
      label = "Pitched";
      color = "yellow";
      break;
    case "Selected":
      label = "Selected";
      color = "green";
      break;
    case "Not Pitched":
      label = "Not Pitched";
      color = "red";
      break;
    case "Requested":
      label = "Requested";
      color = "blue";
      break;
  }

  return (
    <div className={`border m-2 ${Style.newReleaseItem}`}>
      <Link href={`/marketing/details/${btoa(albumId)}`}>
        <Image
          src={imageSrc}
          alt="album"
          width={200}
          height={200}
          className={Style.albumImage}
        />
        <div className="p-1">
          <p className={`m-0 ${Style.albumName}`}>
            {albumName.length > 15 ? `${albumName.slice(0, 12)}...` : albumName}
          </p>
          <p className={`m-0 ${Style.albumArtistName}`}>
            {albumArtist.length > 10 ? `${albumArtist.slice(0, 10)}...` : albumArtist}
          </p>
        </div>
      </Link>

      {/* Handle Tailwind CSS dynamic classes */}
      <div
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium 
        ${color === "purple" ? "bg-purple-50 text-purple-700 ring-purple-600/10" : ""}
        ${color === "blue" ? "bg-blue-50 text-blue-700 ring-blue-600/10" : ""}
        ${color === "green" ? "bg-green-50 text-green-700 ring-green-600/10" : ""}
        ${color === "red" ? "bg-red-50 text-red-700 ring-red-600/10" : ""}
        ${color === "yellow" ? "bg-yellow-50 text-yellow-700 ring-yellow-600/10" : ""}
        ring-1 ring-inset ${Style.albumStatusBadge} `}
      >
        {label}
      </div>
    </div>
  );
};

export default MarketingCard;
