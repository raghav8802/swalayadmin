import mongoose, { Schema, Document } from "mongoose";


export interface iAdmin extends Document {
    username: string;
    email: string;
    password: string;
    usertype: string;
    verifyCode: string;
    verifyCodeExpiry: Date | null;
    isVerified: boolean;
    isLable: boolean;
    lable: string;
    joinedAt: Date;
    isActive: boolean;

}


const AdminSchema: Schema<iAdmin> = new Schema({

    username: {
        type: String,
        required: [true, 'Username required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        trim: true,
    },
    usertype: {
        type: String,
        enum: ['admin', 'customerSupport', 'contentDeployment', 'ANR'],
        default: 'admin'
    },
    verifyCode: {
        type: String,
        default: undefined
    },
    verifyCodeExpiry: {
        type: Date || null,
        default: undefined
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isLable: {
        type: Boolean,
        default: false
    },
    lable: {
        type: String,
        default: null
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }


})


const Admin = (mongoose.models.Admin as mongoose.Model<iAdmin>) || mongoose.model<iAdmin>("Admin", AdminSchema)


export default Admin

