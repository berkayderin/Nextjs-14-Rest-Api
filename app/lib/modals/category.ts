import { Schema, model, models } from 'mongoose'

const CategorySchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{
		timestamps: true
	}
)

const Category = models.Category || model('Category', CategorySchema)

export default Category
