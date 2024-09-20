import { Modal } from '@/components/Modal';
import UserContext from '@/context/userContext';
import { apiPost } from '@/helpers/axiosRequest';
import React, { useContext,  useState } from 'react';
import toast from "react-hot-toast";



const extractID = (url: any) => {
    const id = url.split('/').pop();
    return id || '';
};

const ArtistModalForm = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {

    const context = useContext(UserContext);
    const labelId = context?.user?._id;

    const [formData, setFormData] = useState({
        artistName: '',
        spotifyID: '',
        appleID: '',
        instagramID: '',
        facebookID: '',
        isIPRSMember: false,
        iprsNumber: '',
    });


    const [artistType, setArtistType] = useState({
        singer: false,
        lyricist: false,
        composer: false,
        producer: false,
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value,
        };

        switch (name) {
            case 'spotify':
                newFormData.spotifyID = extractID(value);
                break;
            case 'apple':
                newFormData.appleID = extractID(value);
                break;
            case 'instagram':
                newFormData.instagramID = extractID(value);
                break;
            case 'facebook':
                newFormData.facebookID = extractID(value);
                break;
            default:
                break;
        }

        setFormData(newFormData);
    };

    const handleSave = async () => {
        
        console.log("all data");
        console.log(formData);
        const data = {
            labelId: labelId,
            artistName: formData.artistName,
            iprs: formData.isIPRSMember,
            iprsNumber: formData.iprsNumber,
            facebook: formData.facebookID,
            appleMusic: formData.appleID,
            spotify: formData.spotifyID,
            instagram: formData.instagramID,
            isSinger: artistType.singer,
            isLyricist: artistType.lyricist,
            isComposer: artistType.composer,
            isProducer: artistType.producer,
        }
        console.log(JSON.stringify(data));
        const response = await apiPost('/api/artist/addArtist', data)
        console.log("api response");
        console.log(response);



        setFormData({artistName: '', spotifyID: '', appleID: '', instagramID: '', facebookID: '', isIPRSMember: false, iprsNumber: '' });
        setArtistType({ singer: false, lyricist: false, composer: false, producer: false, });


        onClose();

        setTimeout(() => {
            toast.success("Success! New artist added")
        }, 500);

    };

    return (
        <Modal
            isVisible={isVisible}
            triggerLabel="Submit"
            title="New Artist"
            onSave={handleSave}
            onClose={onClose}
            description="Note: You can add multiple artist types to a single artist"
        >

            <div>
                <label className="form-label" htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.artistName}
                    onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                    className="form-control"
                    placeholder="Write artist name"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="form-label" htmlFor="spotify">Spotify ID</label>
                    <input
                        type="url"
                        id="spotify"
                        name="spotify"
                        value={formData.spotifyID}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Spotify url of artist"
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="apple">Apple Music</label>
                    <input
                        type="url"
                        id="apple"
                        name="apple"
                        value={formData.appleID}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Apple url of artist"
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="instagram">Instagram URL</label>
                    <input
                        type="url"
                        id="instagram"
                        name="instagram"
                        value={formData.instagramID}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Instagram url of artist"
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="facebook">Facebook URL</label>
                    <input
                        type="url"
                        id="facebook"
                        name="facebook"
                        value={formData.facebookID}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Facebook url of artist"
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="isIPRSMember">IPRS Member?</label>
                    {/* <ul className="flex items-center">
            <li className="w-1/2">
              <div className="flex items-center ps-3">
                <input
                  id="horizontal-list-radio-license"
                  type="radio"
                  value="true"
                  name="isIPRSMember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                  checked={formData.isIPRSMember === true}
                  onChange={(e) => setFormData(prevFormData => ({
                    ...prevFormData,
                    isIPRSMember: e.target.value === "true"
                  }))}
                />
                <label
                  htmlFor="horizontal-list-radio-license"
                  className="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Yes
                </label>
              </div>
            </li>

            <li className="w-1/2">
              <div className="flex items-center ps-3">
                <input
                  id="horizontal-list-radio-id"
                  type="radio"
                  value="false"
                  name="isIPRSMember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                  checked={formData.isIPRSMember === false}
                  onChange={(e) =>  setFormData(prevFormData => ({
                    ...prevFormData,
                    isIPRSMember: e.target.value === "false"
                  }))}
                />
                <label
                  htmlFor="horizontal-list-radio-id"
                  className="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  No
                </label>
              </div>
            </li>
          </ul> */}

                    <ul className="flex items-center">
                        <li className="w-1/2">
                            <div className="flex items-center ps-3">
                                <input
                                    id="horizontal-list-radio-license"
                                    type="radio"
                                    value="true"
                                    name="isIPRSMember"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                                    checked={formData.isIPRSMember === true}
                                    onChange={() => setFormData(prevFormData => ({
                                        ...prevFormData,
                                        isIPRSMember: true
                                    }))}
                                />
                                <label
                                    htmlFor="horizontal-list-radio-license"
                                    className="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    Yes
                                </label>
                            </div>
                        </li>

                        <li className="w-1/2">
                            <div className="flex items-center ps-3">
                                <input
                                    id="horizontal-list-radio-id"
                                    type="radio"
                                    value="false"
                                    name="isIPRSMember"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                                    checked={formData.isIPRSMember === false}
                                    onChange={() => setFormData(prevFormData => ({
                                        ...prevFormData,
                                        isIPRSMember: false
                                    }))}
                                />
                                <label
                                    htmlFor="horizontal-list-radio-id"
                                    className="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    No
                                </label>
                            </div>
                        </li>
                    </ul>



                </div>

                <div>
                    <label className="form-label" htmlFor="iprsNumber">IPRS Number</label>
                    <input
                        type="text"
                        id="iprsNumber"
                        name="iprsNumber"
                        disabled={formData.isIPRSMember ? false : true}
                        value={formData.iprsNumber}
                        onChange={(e) => setFormData({ ...formData, iprsNumber: e.target.value })}
                        className={`form-control ${formData.isIPRSMember ? '' : 'form-disabled'} `}
                        placeholder="Write IPRS Number"
                    />
                </div>
            </div>

            <label className="mb-0" htmlFor="artistType">Artist Type</label>
            <div className="flex">
                <div className="flex items-center me-5">
                    <input
                        id="inline-checkbox-singer"
                        type="checkbox"
                        name="singer"
                        checked={artistType.singer}
                        onChange={(e) => setArtistType(prev => ({ ...prev, singer: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="inline-checkbox-singer" className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Singer</label>
                </div>

                <div className="flex items-center me-5">
                    <input
                        id="inline-checkbox-lyricist"
                        type="checkbox"
                        name="lyricist"
                        checked={artistType.lyricist}
                        onChange={(e) => setArtistType(prev => ({ ...prev, lyricist: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="inline-checkbox-lyricist" className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Lyricist</label>
                </div>

                <div className="flex items-center me-5">
                    <input
                        id="inline-checkbox-composer"
                        type="checkbox"
                        name="composer"
                        checked={artistType.composer}
                        onChange={(e) => setArtistType(prev => ({ ...prev, composer: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="inline-checkbox-composer" className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Composer</label>
                </div>

                <div className="flex items-center me-5">
                    <input
                        id="inline-checkbox-producer"
                        type="checkbox"
                        name="producer"
                        checked={artistType.producer}
                        onChange={(e) => setArtistType(prev => ({ ...prev, producer: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="inline-checkbox-producer" className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Producer</label>
                </div>
            </div>
        </Modal>
    );
};

export default ArtistModalForm;
