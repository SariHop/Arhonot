import IConnectionRequest from "@/app/types/IConnectionRequest";
import mongoose, { Model, Schema, Types } from "mongoose";

const ConnectionRequestSchema: Schema<IConnectionRequest> = new Schema({
    userIdSender: { type: Types.ObjectId, required: true, ref: 'User' }, 
    userIdReciver: { type: Types.ObjectId, required: true, ref: 'User' }, 
    status: { type: String, required: true , enum: ['accepted', 'rejected', 'waiting']}, 
    readen: { type: Boolean, required: true }, 
    date: { type: Date, required: true, validate: [function(value: Date) {
        return value <= new Date(); 
    }, "Date of request must be in the past"] },
    sendersName: {type: String, required: true},
});

const ConnectionRequest:Model<IConnectionRequest> = mongoose.models.ConnectionRequest || mongoose.model<IConnectionRequest>('ConnectionRequest',ConnectionRequestSchema)
export default ConnectionRequest;