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
  };
  workPolicy: {
    status: 'Completed' | 'Pending';
    document?: string;
  };
}

// Define the schema for the Employee model
const EmployeeSchema = new Schema<IEmployee>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
        // required: true
    },
    photo: { type: String, required: false },
    fullName: { type: String, required: true },
    officialEmail: {
      type: String,
      required: true,
      validate: {
        validator: (email: string) =>
          /^.+@talantoncore\.in$/.test(email), // Enforce domain validation
        message: 'Official email must end with @talantoncore.in',
      },
    },
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
    dateOfBirth: { type: Date, required: false },
    aadharCardNumber: {
      type: String,
      required: true,
      validate: {
        validator: (aadhar: string) => /^[0-9]{12}$/.test(aadhar), // 12-digit Aadhar number
        message: 'Aadhar Card Number must be a 12-digit number',
      },
    },
    panCardNumber: {
      type: String,
      required: true,
      validate: {
        validator: (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan), // PAN Card validation
        message: 'Invalid PAN Card Number',
      },
    },
    bankAccountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bank: { type: String, required: true },
    branch: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    manager: {
      name: { type: String, required: true },
      contact: {
        type: String,
        required: true,
        validate: {
          validator: (phone: string) => /^[0-9]{10}$/.test(phone),
          message: 'Manager contact must be a 10-digit number',
        },
      },
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Not Active'],
    },
    terminationDate: {
      type: Date,
      validate: {
        validator: function (this: IEmployee, date: Date) {
          return this.status === 'Not Active' ? !!date : true;
        },
        message: 'Termination date is required if the employee is Not Active',
      },
    },
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
        required: function (this: IEmployee) {
          return this.ndaSignature.status === 'Completed';
        },
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
        required: function (this: IEmployee) {
          return this.workPolicy.status === 'Completed';
        },
      },
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Export the model
const Employee =
  models.Employee || model<IEmployee>('Employee', EmployeeSchema);

export default Employee;

