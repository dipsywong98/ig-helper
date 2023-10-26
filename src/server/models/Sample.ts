import { model, Schema } from 'mongoose';

interface SampleDoc {
  message: string
}

const schema = new Schema<SampleDoc>({
  message: {
    type: String, required: true,
  },
}, { timestamps: true, versionKey: false });

export const Sample = model<SampleDoc>('Sample', schema);
