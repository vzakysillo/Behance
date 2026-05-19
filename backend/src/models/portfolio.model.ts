import mongoose, { Model } from "mongoose";

export interface IPortfolio {
  name: string;
  description?: string;
  cover?: string;
  photos: string[];
}

const portfolioSchema = new mongoose.Schema<IPortfolio>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },

    cover: { type: String },

    photos: { type: [String], default: [] },
  },
  { versionKey: false }
);

const Portfolio: Model<IPortfolio> = mongoose.model<IPortfolio>(
  "Portfolio",
  portfolioSchema
);

export default Portfolio;