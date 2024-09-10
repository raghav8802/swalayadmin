import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type Album = {
  albumId: string;
  albumName: string;
  trackName: string;
  thumbnail: string;
  workAs: string[]; // Adjust this to match the API response
};

const AlbumCard = ({ album }: { album: Album }) => (
  <Card className="overflow-hidden">
    <Link href={`/albums/viewalbum/${btoa(album.albumId)}`}>
    <div className="p-3">
      {album && album.thumbnail && (
        <Image 
          src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album.albumId}ba3/cover/${album.thumbnail}`}
          alt="album thumbnail"
          width={350}
          height={400}
          unoptimized
        />
      )}
    </div>
    <CardContent className="p-4">
      <h3 className="font-semibold text-lg line-clamp-1">{album.albumName}</h3>
      <p className="text-sm text-muted-foreground line-clamp-1">
        <b>Track : </b> {album.trackName}
      </p>
      <p className="text-sm text-muted-foreground line-clamp-1">
       <b>As</b> {album.workAs.join(", ")} 
      </p>
    </CardContent>
    </Link>
  </Card>
);

export default AlbumCard;
