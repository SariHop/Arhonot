import IConnectionRequest from "@/app/types/IConnectionRequest";
import mongoose, { Model, Schema } from "mongoose";

const ConnectionRequestSchema : Schema<IConnectionRequest> = new Schema({
    userIdSender: {type: String, required: true},
    userIdReciver:{type: String, required: true},
    status: {type:Boolean, required:true },
    readen: {type:Boolean, required:true },
})

const ConnectionRequest:Model<IConnectionRequest> = mongoose.models.ConnectionRequest || mongoose.model<IConnectionRequest>('ConnectionRequest',ConnectionRequestSchema)
export default ConnectionRequest;