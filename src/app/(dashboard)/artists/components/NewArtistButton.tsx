"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ArtistModalForm from "@/components/ArtistModalForm";

export default function NewArtistButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>New Artist</Button>
      <ArtistModalForm 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
      />
    </>
  );
}