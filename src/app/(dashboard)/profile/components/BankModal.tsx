'use client'

import { Modal } from '@/components/Modal';
import UserContext from '@/context/userContext';
import { apiPost } from '@/helpers/axiosRequest';
import React, { useContext, useState } from 'react';
import toast from "react-hot-toast";




const BankModal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {

    const context = useContext(UserContext);
    const labelId = context?.user?._id;
    // console.log("labelId");
    // console.log(labelId);


    const [accountDetails, setAccountDetails] = useState({
        accountHolderName: '',
        bankName: '',
        branchName: '',
        gstNo: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        pan: '',
    });

    // You can handle changes with a single function
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setAccountDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    // const [formData, setFormData] = useState({
    //     trackId: '',
    //     youtubeUrl: ''
    // });


    const handleSave = async () => {


        try {


            const response = await apiPost('/api/bank/updatedetails',
                {
                    labelId, accountDetails
                })


            if (response.success) {
                onClose();
                toast.success("Bank details updated")

                setAccountDetails({
                    accountHolderName: '',
                    bankName: '',
                    branchName: '',
                    gstNo: '',
                    accountNumber: '',
                    ifscCode: '',
                    upiId: '',
                    pan: '',
                })

            } else {
                onClose();
                toast.success("Internal server error")
            }


        } catch (error) {
            toast.success("Internal server error")

        }


    };

    return (
        <Modal
            isVisible={isVisible}
            triggerLabel="Submit"
            title="Bank Details"
            onSave={handleSave}
            onClose={onClose}
        >


            <div className="grid grid-cols-12 gap-2">

                <div className="col-span-6">
                    <div className='mb-2'>
                        <label className="form-label" htmlFor="accountHolderName">Account Holder Name</label>
                        <input
                            id="accountHolderName"
                            type="text"
                            name="accountHolderName"
                            placeholder='Enter account holder name'
                            value={accountDetails.accountHolderName}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="col-span-6">
                    <div className='mb-2'>
                        <label className="form-label" htmlFor="bankName">Bank Name</label>
                        <input
                            id="bankName"
                            type="text"
                            name="bankName"
                            placeholder='Enter bank name'
                            value={accountDetails.bankName}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="col-span-6">
                    <div className='mb-2'>
                        <label className="form-label" htmlFor="branchName">Branch Name</label>
                        <input
                            id="branchName"
                            type="text"
                            name="branchName"
                            placeholder='Enter branch name'
                            value={accountDetails.branchName}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="col-span-6">
                    <div className='mb-2'>
                        <label className="form-label" htmlFor="gstNo">GST NO</label>
                        <input
                            id="gstNo"
                            type="text"
                            name="gstNo"
                            placeholder='Enter GST number'
                            value={accountDetails.gstNo}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="col-span-6">
                    <div className='mb-2'>
                        <label className="form-label" htmlFor="accountNumber">Account Number</label>
                        <input
                            id="accountNumber"
                            type="text"
                            name="accountNumber"
                            placeholder='Enter account number'
                            value={accountDetails.accountNumber}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="col-span-6">
                    <div className='mb-2'>
                        <label className="form-label" htmlFor="ifscCode">IFSC Code</label>
                        <input
                            id="ifscCode"
                            type="text"
                            name="ifscCode"
                            placeholder='Enter IFSC code'
                            value={accountDetails.ifscCode}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="col-span-6">
                    <div className='mb-2'>
                        <label className="form-label" htmlFor="upiId">UPI Id</label>
                        <input
                            id="upiId"
                            type="text"
                            name="upiId"
                            placeholder='Enter UPI ID'
                            value={accountDetails.upiId}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="col-span-6">
                    <div className='mb-2'>
                        <label className="form-label" htmlFor="pan">PAN</label>
                        <input
                            id="pan"
                            type="text"
                            name="pan"
                            placeholder='Enter PAN'
                            value={accountDetails.pan}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>


            </div>




        </Modal>
    );
};

export default BankModal;



