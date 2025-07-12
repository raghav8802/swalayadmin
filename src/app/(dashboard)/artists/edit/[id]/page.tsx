"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Artist {
  _id: string;
  artistName: string;
  iprs: boolean;
  iprsNumber: string;
  facebook: string;
  appleMusic: string;
  spotify: string;
  instagram: string;
  isSinger: boolean;
  isLyricist: boolean;
  isComposer: boolean;
  isProducer: boolean;
}

export default function EditArtist({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Artist>({
    _id: '',
    artistName: '',
    iprs: false,
    iprsNumber: '',
    facebook: '',
    appleMusic: '',
    spotify: '',
    instagram: '',
    isSinger: false,
    isLyricist: false,
    isComposer: false,
    isProducer: false
  });

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistId = atob(params.id);
        const response:any = await apiGet(`/api/artist/getArtistInfo?id=${artistId}`);
        if (response.success) {
          setFormData(response.data);
        } else {
          toast.error("Failed to fetch artist details");
        }
      } catch (error) {
        toast.error("Error fetching artist details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtist();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Remove leading @ symbol if present
    const cleanValue = value.startsWith('@') ? value.substring(1) : value;
    setFormData(prev => ({
      ...prev,
      [name]: cleanValue
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response:any = await apiPost('/api/artist/updateArtist', formData);
      if (response.success) {
        toast.success("Artist updated successfully");
        router.push('/artists');
      } else {
        toast.error(response.message || "Failed to update artist");
      }
    } catch (error) {
      toast.error("Error updating artist");
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="w-full h-full p-6 bg-white rounded-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/artists">Artists</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Artist</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Edit Artist: {formData.artistName}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spotify URL</label>
              <input
                type="text"
                name="spotify"
                value={formData.spotify}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apple Music URL</label>
              <input
                type="text"
                name="appleMusic"
                value={formData.appleMusic}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IPRS Member?</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="iprs"
                    checked={formData.iprs === true}
                    onChange={() => setFormData(prev => ({ ...prev, iprs: true }))}
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="iprs"
                    checked={formData.iprs === false}
                    onChange={() => setFormData(prev => ({ ...prev, iprs: false }))}
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {formData.iprs && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IPRS Number</label>
                <input
                  type="text"
                  name="iprsNumber"
                  value={formData.iprsNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Artist Type</label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isSinger"
                  checked={formData.isSinger}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Singer</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isLyricist"
                  checked={formData.isLyricist}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Lyricist</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isComposer"
                  checked={formData.isComposer}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Composer</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isProducer"
                  checked={formData.isProducer}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Producer</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Artist
            </button>
            <button
              type="button"
              onClick={() => router.push('/artists')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 