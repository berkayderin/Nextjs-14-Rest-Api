import Blog from '@/lib/modals/blog'
import Category from '@/lib/modals/category'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import User from '@/lib/modals/user'
import connect from '@/lib/db'

// blog getirme route
export const GET = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')
		const categoryId = searchParams.get('categoryId')

		const searchKeywords = searchParams.get('keywords')

		const startDate = searchParams.get('startDate')
		const endDate = searchParams.get('endDate')

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bilgileri geçersiz' }), { status: 400 })
		}

		if (categoryId && !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse(JSON.stringify({ message: 'Kategori bilgileri geçersiz' }), { status: 400 })
		}

		await connect()

		const user = await User.findById(userId)

		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bulunamadı' }), { status: 404 })
		}

		const category = await Category.findById(categoryId)

		if (categoryId && !category) {
			return new NextResponse(JSON.stringify({ message: 'Kategori bulunamadı' }), { status: 404 })
		}

		const filter: any = {
			user: new Types.ObjectId(userId),
			category: new Types.ObjectId(categoryId || '')
		}

		// TODO: searchKeywords ile arama yapılacak
		if (searchKeywords) {
			filter.$or = [
				{ title: { $regex: searchKeywords, $options: 'i' } }, // i -> büyük küçük harf duyarlılığı kaldırır
				{ description: { $regex: searchKeywords, $options: 'i' } }
			]
		} else if (!searchKeywords && !categoryId) {
			return new NextResponse(
				JSON.stringify({ message: 'Arama yapmak için anahtar kelime veya kategori belirtmelisiniz' }),
				{ status: 400 }
			)
		}

		// TODO: startDate ve endDate arasındaki blogları getir
		if (startDate && endDate) {
			filter.createdAt = {
				$gte: new Date(startDate),
				$lte: new Date(endDate)
			}
		} else if (startDate) {
			filter.createdAt = {
				$gte: new Date(startDate)
			}
		} else if (endDate) {
			filter.createdAt = {
				$lte: new Date(endDate)
			}
		}

		const blogs = await Blog.find(filter).sort({ createdAt: 'asc' }) // asc -> artan, desc -> azalan

		return new NextResponse(JSON.stringify({ blogs }), { status: 200 })
	} catch (error: any) {
		return new NextResponse('Bloglar getirilirken bir hata oluştu' + error.message, { status: 500 })
	}
}

// blog oluşturma route
export const POST = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')
		const categoryId = searchParams.get('categoryId')

		const body = await request.json()
		const { title, description } = body

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

		const category = await Category.findById(categoryId)

		if (!category) {
			return new NextResponse(JSON.stringify({ message: 'Kategori bulunamadı' }), { status: 404 })
		}

		const newBlog = new Blog({
			title,
			description,
			user: new Types.ObjectId(userId),
			category: new Types.ObjectId(categoryId)
		})

		await newBlog.save()

		return new NextResponse(JSON.stringify({ message: 'Blog oluşturuldu' }), { status: 201 })
	} catch (error: any) {
		return new NextResponse('Blog oluşturulurken bir hata oluştu' + error.message, { status: 500 })
	}
}
