import Blog from '@/lib/modals/blog'
import Category from '@/lib/modals/category'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import User from '@/lib/modals/user'
import connect from '@/lib/db'

// tek bir blog getirme route
export const GET = async (request: Request, context: { params: any }) => {
	const { blogId } = context.params

	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')
		const categoryId = searchParams.get('categoryId')

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bilgileri geçersiz' }), { status: 400 })
		}

		if (categoryId && !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse(JSON.stringify({ message: 'Kategori bilgileri geçersiz' }), { status: 400 })
		}

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse(JSON.stringify({ message: 'Blog bilgileri geçersiz' }), { status: 400 })
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

		const blog = await Blog.findOne({
			_id: blogId,
			user: userId,
			category: categoryId
		})

		if (!blog) {
			return new NextResponse(JSON.stringify({ message: 'Blog bulunamadı' }), { status: 404 })
		}

		return new NextResponse(JSON.stringify({ blog }), { status: 200 })
	} catch (error: any) {
		return new NextResponse('Blog getirilirken bir hata oluştu' + error.message, { status: 500 })
	}
}

// blog güncelleme route
export const PATCH = async (request: Request, context: { params: any }) => {
	const { blogId } = context.params

	console.log('blogId', blogId)

	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')
		const categoryId = searchParams.get('categoryId')

		const body = await request.json()
		const { title, description } = body

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bilgileri geçersiz' }), { status: 400 })
		}

		if (categoryId && !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse(JSON.stringify({ message: 'Kategori bilgileri geçersiz' }), { status: 400 })
		}

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse(JSON.stringify({ message: 'Blog bilgileri geçersiz' }), { status: 400 })
		}

		await connect()

		const user = await User.findById(userId)

		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bulunamadı' }), { status: 404 })
		}

		const blog = await Blog.findOne({
			_id: blogId,
			user: userId
		})

		if (!blog) {
			return new NextResponse(JSON.stringify({ message: 'Blog bulunamadı' }), { status: 404 })
		}

		const updatedBlog = await Blog.findByIdAndUpdate(blogId, { title, description }, { new: true })

		return new NextResponse(JSON.stringify({ blog: updatedBlog }), { status: 200 })
	} catch (error: any) {
		return new NextResponse('Blog güncellenirken bir hata oluştu' + error.message, { status: 500 })
	}
}

// blog silme route
export const DELETE = async (request: Request, context: { params: any }) => {
	const { blogId } = context.params

	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bilgileri geçersiz' }), { status: 400 })
		}

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse(JSON.stringify({ message: 'Blog bilgileri geçersiz' }), { status: 400 })
		}

		await connect()

		const user = await User.findById(userId)

		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'Kullanıcı bulunamadı' }), { status: 404 })
		}

		const blog = await Blog.findOne({
			_id: blogId,
			user: userId
		})

		if (!blog) {
			return new NextResponse(JSON.stringify({ message: 'Blog bulunamadı' }), { status: 404 })
		}

		await Blog.findByIdAndDelete(blogId)

		return new NextResponse(JSON.stringify({ message: 'Blog başarıyla silindi' }), { status: 200 })
	} catch (error: any) {
		return new NextResponse('Blog silinirken bir hata oluştu' + error.message, { status: 500 })
	}
}
