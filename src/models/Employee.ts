import mongoose, { Schema, Document, model, models } from 'mongoose';

// Define an interface for the Employee document
interface IEmployee extends Document {
userId: mongoose.Schema.Types.ObjectId;
  photo: string;
  fullName: string;
  officialEmail: string;
  personalEmail: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: Date;
  aadharCardNumber: string;
  panCardNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  bank: string;
  branch: string;
  joiningDate: Date;
  role: string;
  department: string;
  manager: {
    name: string;
    contact: string;
  };
  status: 'Active' | 'Not Active';
  terminationDate?: Date;
  employeeVerification: 'Completed' | 'Pending';
  ndaSignature: {
    status: 'Completed' | 'Pending';
    document?: string;
    fileName?: string;
  };
  workPolicy: {
    status: 'Completed' | 'Pending';
    document?: string;
    fileName?: string;
  };
  type: 'Full Time' | 'Intern';
  salary: number;
}

// Define the schema for the Employee model
const EmployeeSchema = new Schema<IEmployee>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
        // required: true
    },
    photo: { type: String, required: false },
    // Personal Details (Basic Info) - Required
    fullName: { type: String, required: true },
    personalEmail: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: (phone: string) => /^[0-9]{10}$/.test(phone), // Ensure 10-digit phone number
        message: 'Phone number must be a 10-digit number',
      },
    },
    address: { type: String, required: true },
    aadharCardNumber: {
      type: String,
      required: true,
      validate: {
        validator: (aadhar: string) => /^[0-9]{12}$/.test(aadhar), // 12-digit Aadhar number
        message: 'Aadhar Card Number must be a 12-digit number',
      },
    },
    dateOfBirth: { type: Date, required: false },
    panCardNumber: { type: String, required: false },
    
    // Bank Details - Optional
    bankAccountNumber: { type: String, required: false },
    ifscCode: { type: String, required: false },
    bank: { type: String, required: false },
    branch: { type: String, required: false },
    
    // Official Details - Optional
    officialEmail: {
      type: String,
      required: false,
      validate: {
        validator: (email: string) =>
          /^.+@talantoncore\.in$/.test(email), // Enforce domain validation
        message: 'Official email must end with @talantoncore.in',
      },
    },
    joiningDate: { type: Date, required: false },
    role: { type: String, required: false },
    department: { type: String, required: false },
    type: { type: String, required: false, enum: ['Full Time', 'Intern'] },
    salary: { type: Number, required: false },
    manager: {
      name: { type: String, required: false },
      contact: {
        type: String,
        required: false,
        validate: {
          validator: (phone: string) => /^[0-9]{10}$/.test(phone),
          message: 'Manager contact must be a 10-digit number',
        },
      },
    },
    status: {
      type: String,
      required: false,
      enum: ['Active', 'Not Active'],
      default: 'Active',
    },
    terminationDate: {
      type: Date,
      required: false,
      validate: {
        validator: function (date: Date) {
          return this.status === 'Not Active' ? !!date : true;
        },
        message: 'Termination date is required if the employee is Not Active',
      },
    },
    
    // Documentation - Optional
    employeeVerification: {
      type: String,
      required: false,
      enum: ['Completed', 'Pending'],
      default: "Pending",
    },
    ndaSignature: {
      status: {
        type: String,
        required: false,
        enum: ['Completed', 'Pending'],
        default: "Pending",
      },
      document: {
        type: String,
        required: false,
      },
      fileName: {
        type: String,
        required: false,
      },
    },
    workPolicy: {
      status: {
        type: String,
        default: "Pending",
        required: false,
        enum: ['Completed', 'Pending'],
      },
      document: {
        type: String,
        required: false,
      },
      fileName: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Export the model
const Employee =
  models.EmployeeData || model<IEmployee>('EmployeeData', EmployeeSchema);

export default Employee;


