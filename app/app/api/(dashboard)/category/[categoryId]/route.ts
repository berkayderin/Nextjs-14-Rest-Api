import Category from '@/lib/modals/category'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import User from '@/lib/modals/user'
import connect from '@/lib/db'

export const PATCH = async (request: Request, context: { params: any }) => {
	const { categoryId } = context.params

	console.log('kategori id: ', categoryId)

	try {
		const body = await request.json()
		const { title } = body

		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bilgileri geçersiz' }), { status: 400 })
		}

		if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse(JSON.stringify({ message: 'Kategori bilgileri geçersiz' }), { status: 400 })
		}

		await connect()

		const user = await User.findById(userId)

		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bulunamadı' }), { status: 404 })
		}

		const category = await Category.findOne({ _id: categoryId, user: userId })

		if (!category) {
			return new NextResponse(JSON.stringify({ message: 'Kategori bulunamadı' }), { status: 404 })
		}

		const updatedCategory = await Category.findByIdAndUpdate(categoryId, { title }, { new: true })

		return new NextResponse(JSON.stringify({ message: 'Kategori başarıyla güncellendi', category: updatedCategory }), {
			status: 200
		})
	} catch (error: any) {
		return new NextResponse('Kategori güncellenirken bir hata oluştu' + error.message, { status: 500 })
	}
}
