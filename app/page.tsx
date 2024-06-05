import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
	return (
		<main className="flex flex-col items-center space-y-5 justify-center h-screen bg-gray-100">
			<Image src="/favicon.ico" alt="Logo" width={100} height={100} />
			<div className="flex space-x-4">
				<Link href="/login">
					<Button>Giriş Yap</Button>
				</Link>
				<Link href="/register">
					<Button variant="outline">Kayıt Ol</Button>
				</Link>
				<Link href="/dashboard">
					<Button variant="destructive">Dashboard</Button>
				</Link>
			</div>
		</main>
	)
}
