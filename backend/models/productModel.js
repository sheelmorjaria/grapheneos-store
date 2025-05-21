import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
      default: 'Google Pixel',
    },
    category: {
      type: String,
      required: true,
      default: 'Smartphone',
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    modelName: {
      type: String,
      required: true,
      enum: [
        'Pixel 9a',
        'Pixel 9 Pro Fold',
        'Pixel 9 Pro XL',
        'Pixel 9 Pro',
        'Pixel 9',
        'Pixel 8a',
        'Pixel 8 Pro',
        'Pixel 8',
        'Pixel Fold',
        'Pixel Tablet',
        'Pixel 7a',
        'Pixel 7 Pro',
        'Pixel 7',
        'Pixel 6a',
        'Pixel 6 Pro',
        'Pixel 6'
      ],
    },
    storage: {
      type: String,
      required: true,
      enum: ['64GB', '128GB', '256GB', '512GB', '1TB'],
    },
    color: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C'],
      default: 'A',
    },
    // Add description of what each condition means
    conditionDescription: {
      type: String,
      required: function() { return this.condition !== undefined; }    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function(next) {
  if (this.condition) {
    const descriptions = {
      'A': 'Excellent - Like new with minimal signs of use. Perfect working condition.',
      'B': 'Good - Light scratches or wear. Fully functional with great battery life.',
      'C': 'Fair - Visible scratches and signs of use. 100% functional with good battery life.'
    };
    this.conditionDescription = descriptions[this.condition];
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;