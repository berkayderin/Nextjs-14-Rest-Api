import { NextResponse } from 'next/server'
import User from '@/lib/modals/user'
import connect from '@/lib/db'

export const GET = async () => {
	try {
		await connect()
		const users = await User.find()
		return new NextResponse(JSON.stringify(users), { status: 200 })
	} catch (error: any) {
		return new NextResponse('Kullanıcılar getirilirken bir hata oluştur' + error.message, { status: 500 })
	}
}
