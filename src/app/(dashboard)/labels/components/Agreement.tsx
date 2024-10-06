"use client"

import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from "@/components/ui/button"

const Agreement: React.FC = () => {
  const handleDownloadPdf = async () => {
    const tempDiv = document.createElement('div')
    tempDiv.style.width = '210mm'
    tempDiv.style.padding = '20mm'
    tempDiv.style.backgroundColor = '#fff'

    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">Agreement of Understanding</h1>
        
        <p style="text-align: right;">Date: ${new Date().toLocaleDateString()}</p>
        
        <p>This Agreement (the "Agreement") is entered into between:</p>
        
        <p><strong>Party A:</strong> ______________________ (hereinafter referred to as "Party A")</p>
        
        <p><strong>Party B:</strong> ______________________ (hereinafter referred to as "Party B")</p>
        
        <h2 style="color: #2c3e50; margin-top: 20px;">1. Purpose</h2>
        <p>The purpose of this Agreement is to outline the terms and conditions under which both parties will collaborate on [Project/Venture Name].</p>
        
        <h2 style="color: #2c3e50; margin-top: 20px;">2. Responsibilities</h2>
        <p><strong>2.1 Party A</strong> shall be responsible for:</p>
        <ul>
          <li>Responsibility 1</li>
          <li>Responsibility 2</li>
          <li>Responsibility 3</li>
        </ul>
        
        <p><strong>2.2 Party B</strong> shall be responsible for:</p>
        <ul>
          <li>Responsibility 1</li>
          <li>Responsibility 2</li>
          <li>Responsibility 3</li>
        </ul>
        
        <h2 style="color: #2c3e50; margin-top: 20px;">3. Duration</h2>
        <p>This Agreement shall commence on [Start Date] and continue until [End Date], unless terminated earlier by mutual agreement of both parties.</p>
        
        <h2 style="color: #2c3e50; margin-top: 20px;">4. Confidentiality</h2>
        <p>Both parties agree to maintain the confidentiality of any proprietary information shared during the course of this Agreement.</p>
        
        <h2 style="color: #2c3e50; margin-top: 20px;">5. Signatures</h2>
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div>
            <p>____________________</p>
            <p>Party A</p>
            <p>Date: ____________</p>
          </div>
          <div>
            <p>____________________</p>
            <p>Party B</p>
            <p>Date: ____________</p>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(tempDiv)

    const canvas = await html2canvas(tempDiv)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('agreement.pdf')

    document.body.removeChild(tempDiv)
  }

  return (
    <Button onClick={handleDownloadPdf}>Download Agreement PDF</Button>
  )
}

export default Agreement