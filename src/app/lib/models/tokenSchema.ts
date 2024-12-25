import  { Model, Schema, Types, model, models } from 'mongoose';
import { IToken } from '../../types/IUser'

const TokenSchema = new Schema<IToken>({
  userId:{ type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 }, // פג תוקף אחרי 15 דקות
});

// ייצוא המודל
const TokenModel: Model<IToken> = models.Token || model<IToken>('Token', TokenSchema);
export default TokenModel;