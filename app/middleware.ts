import { NextResponse } from 'next/server'
import { authMiddleware } from './middlewares/api/authMiddleware'

export const config = {
	matcher: '/api/:path*'
}

export default function middleware(request: Request) {
	const authResult = authMiddleware(request)
	if (!authResult?.isValid) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
	return NextResponse.next()
}
