const validate = (token: any) => {
	const validToken = true
	if (!validToken || !token) {
		return false
	}
	return true
}

export function authMiddleware(req: Request): any {
	const token = req.headers.get('Authorization')?.split(' ')[1]
	return {
		isValid: validate(token)
	}
}
