import mongoose from "mongoose";
import slugify from "slugify";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String,
      required: [
        true,
        "You are joking, right? Video without video file!!! Please upload a video file",
      ],
    },
    thumbnail: {
      type: String,
      required: [true, "thumbnail is required."],
    },
    videoTitle: {
      type: String,
      required: true,
    },

    slug: String,

    description: {
      type: String,
      required: [true, "A description is required"],
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.pre("save", async function (next) {
  if (this.isModified("videoTitle")) {
    let slug = slugify(this.videoTitle, { lower: true }); // Generate original slug based on title
    let slugExists = true;
    let counter = 1;

    while (slugExists) {
      const existingDoc = await this.constructor.findOne({ slug });
      //   We need to find from all the instances. Thus, 'this.contructor' that points to the whole collection

      if (!existingDoc) {
        slugExists = false; // Found a unique slug; break the loop
      } else {
        // Handle duplicate slug by appending a counter or a short random string
        slug = `${slug}-${counter}`; // Append a counter to the original slug
        counter++;
      }
    }

    this.slug = slug;
  }

  next();
});

videoSchema.index({ slug: 1 });
videoSchema.index({ owner: 1 });
videoSchema.index({ isPublished: 1 }); // 'isPublished' is used everytime we send query to show videos in the app.
videoSchema.index({ isPublished: 1, slug: 1 });
videoSchema.index({ isPublished: 1, owner: 1 });
videoSchema.index({ isPublished: 1, owner: 1, slug: 1 });
videoSchema.index({ isPublished: 1, owner: 1, views: 1, slug: 1 });

const Video = mongoose.model("Video", videoSchema);
export default Video;
