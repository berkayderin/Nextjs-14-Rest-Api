import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const Login = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<Card className="w-96">
				<CardHeader>
					<CardTitle className="text-2xl">Giriş Yap</CardTitle>
					<CardDescription>Hoş geldiniz</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">E-posta</Label>
							<Input id="email" type="email" placeholder="abc@gmail.com" required />
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Şifre</Label>
							</div>
							<Input id="password" type="password" required />
							<Link href="#" className="ml-auto inline-block text-sm underline">
								Şifreni mi unuttun?
							</Link>
						</div>
						<Button type="submit" className="w-full">
							Giriş Yap
						</Button>
					</div>
					<div className="mt-4 text-center text-sm">
						Hesabınız yok mu?{' '}
						<Link href="/register" className="underline">
							Kayıt ol
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default Login
