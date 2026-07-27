import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    }

    next();
});

export default mongoose.model("Category", categorySchema);