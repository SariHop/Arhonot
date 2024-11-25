import IConnectionRequest from "@/app/types/IConnectionRequest";
import mongoose, { Model, Schema, Types } from "mongoose";

const ConnectionRequestSchema: Schema<IConnectionRequest> = new Schema({
    userIdSender: { type: Types.ObjectId, required: true, ref: 'User' }, 
    userIdReciver: { type: Types.ObjectId, required: true, ref: 'User' }, 
    status: { type: Boolean, required: true }, 
    readen: { type: Boolean, required: true }, 
});

const ConnectionRequest:Model<IConnectionRequest> = mongoose.models.ConnectionRequest || mongoose.model<IConnectionRequest>('ConnectionRequest',ConnectionRequestSchema)
export default ConnectionRequest;