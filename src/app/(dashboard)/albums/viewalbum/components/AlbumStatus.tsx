import React from "react";

interface AlbumStatusProps {
  status: number;
  comment: string | null;
}

const AlbumStatus: React.FC<AlbumStatusProps> = ({ status = 0, comment='' }) => {

  let statusInfo = {
    text: "",
    colorClass: "",
  };


  switch (status) {
    case 0:
      statusInfo = {
        text: "Draft: Complete the album details to final submit",
        colorClass:
          "text-blue-800 border-t-4 border-blue-300 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800",
      };
      break;
    case 1:
      statusInfo = {
        text: "Processing",
        colorClass:
          "text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:bg-gray-800 dark:border-yellow-800",
      };
      break;
    case 2:
      statusInfo = {
        text: "Album has been approved",
        colorClass:
          "text-blue-800 border-t-4 border-blue-300 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800",
      };
      break;
    case 3:
      statusInfo = {
        text: `Rejected! ${comment}`,
        colorClass:
          "text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800",
      };
      break;
    case 4:
      statusInfo = {
        text: "Album has been successfully published and is now live",
        colorClass:
          "text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800",
      };
      break;
    default:
      statusInfo = {
        text: "Unknown Status",
        colorClass:
          "text-gray-800 border-t-4 border-gray-300 bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-800",
      };
      break;
  }

  return (
    <div
      id="alert-border-1"
      className={`w-100 flex items-center p-4 mb-4 ${statusInfo.colorClass}`}
      role="alert"
    >
      <div className="ms-3 text-sm font-medium">
        {statusInfo.text} 
      </div>
    </div>
  );
};

export default AlbumStatus;
