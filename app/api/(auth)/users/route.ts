import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import User from '@/lib/modals/user'
import connect from '@/lib/db'

// mongoose id kontrolü için
const ObjectId = require('mongoose').Types.ObjectId

// tüm kullanıcıları getirme
export const GET = async () => {
	try {
		await connect()
		const users = await User.find()
		return new NextResponse(JSON.stringify(users), { status: 200 })
	} catch (error: any) {
		return new NextResponse('Kullanıcılar getirilirken bir hata oluştur' + error.message, { status: 500 })
	}
}

// kullanıcı oluşturma
export const POST = async (request: Request) => {
	try {
		const body = await request.json()
		await connect()

		const newUser = new User(body)
		await newUser.save()

		return new NextResponse(JSON.stringify({ message: 'Kullanıcı başarıyla oluşturuldu', user: newUser }), {
			status: 200
		})
	} catch (error: any) {
		return new NextResponse('Kullanıcı oluşturulurken bir hata oluştur' + error.message, { status: 500 })
	}
}

export const PATCH = async (request: Request) => {
	try {
		const body = await request.json()
		const { userId, newUsername } = body

		await connect()

		if (!userId || !newUsername) {
			return new NextResponse('ID veya yeni kullanıcı adı eksik', { status: 400 })
		}

		if (!Types.ObjectId.isValid(userId)) {
			return new NextResponse('Geçersiz ID', { status: 400 })
		}

		const updatedUser = await User.findOneAndUpdate(
			{
				_id: new ObjectId(userId)
			},
			{
				username: newUsername
			},
			{
				new: true
			}
		)

		if (!updatedUser) {
			return new NextResponse('Kullanıcı bulunamadı', { status: 404 })
		}

		return new NextResponse(JSON.stringify({ message: 'Kullanıcı başarıyla güncellendi', user: updatedUser }), {
			status: 200
		})
	} catch (error: any) {
		return new NextResponse('Kullanıcı güncellenirken bir hata oluştur' + error.message, { status: 500 })
	}
}

// kullanıcı silme
export const DELETE = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')

		if (!userId) {
			return new NextResponse('ID eksik', { status: 400 })
		}

		if (!Types.ObjectId.isValid(userId)) {
			return new NextResponse('Geçersiz ID', { status: 400 })
		}

		await connect()

		const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId))

		if (!deletedUser) {
			return new NextResponse('Kullanıcı bulunamadı', { status: 404 })
		}

		return new NextResponse(JSON.stringify({ message: 'Kullanıcı başarıyla silindi', user: deletedUser }), {
			status: 200
		})
	} catch (error: any) {
		return new NextResponse('Kullanıcı silinirken bir hata oluştur' + error.message, { status: 500 })
	}
}
