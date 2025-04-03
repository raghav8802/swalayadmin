//! Delete Button For Album delete

import ConfirmationDialog from "@/components/ConfirmationDialog";
import { apiPost } from "@/helpers/axiosRequest";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AlbumDeleteProps {
    artistId: string;
}

const DeleteArtist: React.FC<AlbumDeleteProps> = ({ artistId }) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDelete = () => {
    setIsDialogOpen(true);
  };

  const handleContinue = async () => {

      try {
        const response:any = await apiPost(`/api/artist/deleteArtist?artistId=${artistId}`, { });

        if (response.success) {
          toast.success("Success! Your artists is deleted");
          router.push('/artists')
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
      <button className={"bg-red-500 text-white px-4 py-3 rounded me-5"} onClick={onDelete}>
        <i className="me-2 bi bi-trash"></i>
        Delete album
      </button>

      <ConfirmationDialog
        confrimationText="Delete"
        show={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContinue={handleContinue}
        title="Are You Sure ?"
        description="Please note that once this artist is deleted, all associated details will be permanently removed and cannot be recovered."
      />

    </div>
  );
};

export default DeleteArtist;
