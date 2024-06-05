import Category from '@/lib/modals/category'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import User from '@/lib/modals/user'
import connect from '@/lib/db'

// kategori getir route
export const GET = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(JSON.stringify({ message: 'Geçersiz kullanıcı ID' }), { status: 400 })
		}

		await connect()

		const user = await User.findById(userId)

		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bulunamadı' }), { status: 404 })
		}

		const categories = await Category.findOneAndDelete({
			user: new Types.ObjectId(userId)
		})

		return new NextResponse(JSON.stringify({ categories }), { status: 200 })
	} catch (error: any) {
		return new NextResponse('Kategoriler getirilirken bir hata oluştu' + error.message, { status: 500 })
	}
}

// kategori ekle route
export const POST = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')

		const { title } = await request.json()

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(JSON.stringify({ message: 'Geçersiz kullanıcı ID' }), { status: 400 })
		}

		await connect()

		const user = await User.findById(userId)

		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bulunamadı' }), { status: 404 })
		}

		const newCategory = new Category({
			title,
			user: new Types.ObjectId(userId)
		})

		await newCategory.save()

		return new NextResponse(JSON.stringify({ message: 'Kategori başarıyla eklendi', category: newCategory }), {
			status: 200
		})
	} catch (error: any) {
		return new NextResponse('Kategori eklenirken bir hata oluştu' + error.message, { status: 500 })
	}
}
