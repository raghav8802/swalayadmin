//! Delete Button For Album delete

import ConfirmationDialog from "@/components/ConfirmationDialog";
import { apiPost } from "@/helpers/axiosRequest";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AlbumDeleteProps {
  albumId: string;
}

const DeleteButton: React.FC<AlbumDeleteProps> = ({ albumId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDelete = () => {
    console.log("dsfsfs");
    setIsDialogOpen(true);
  };

  const handleContinue = async () => {
    console.log("Action continued");

    console.log(albumId)

      try {
        const response:any = await apiPost("/api/albums/deleteAlbum", { albumId });

        if (response.success) {
          toast.success("Success! Your album is deleted");
          router.push('/albums')
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log("error in api", error);
        toast.error("Internal server error");
      }

  };

  return (
    <div>
      <button className={"mt-4 ms-5 mb-2 btn deleteBtn p-3"} onClick={onDelete}>
        <i className="me-2 bi bi-trash"></i>
        Delete Album
      </button>

      <ConfirmationDialog
        confrimationText="Delete"
        show={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContinue={handleContinue}
        title="Are You Sure ?"
        description="Once you delete this album, you will no longer be able to retrieve the album or any tracks associated with it."
      />

    </div>
  );
};

export default DeleteButton;
