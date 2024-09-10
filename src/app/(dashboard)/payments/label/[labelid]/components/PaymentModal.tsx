"use client"
import { Modal } from '@/components/Modal'
import React, { useState } from 'react'

const PaymentModal = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    setIsModalVisible(true);
    console.log('Changes saved ...');
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };



  return (
    <div>
      <Modal
        isVisible={isModalVisible}
        triggerLabel="Add New Payment"
        title="Edit Add New Payment"
        description=''
        onSave={handleSave}
        onClose={handleClose}
      >

        <input type="text" placeholder="Enter your name" />
        <input type="email" placeholder="Enter your email" />
      </Modal>
    </div>
  )
}

export default PaymentModal