import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONDODB_URI

const connect = async () => {
	const connectionState = mongoose.connection.readyState

	if (connectionState === 1) {
		console.log('Veritabanı zaten bağlı')
		return
	}

	if (connectionState === 2) {
		console.log('Veritabanı bağlantısı sağlanıyor...')
		return
	}

	try {
		mongoose.connect(MONGODB_URI!, {
			dbName: 'nextjs14restapi',
			bufferCommands: true
		})
		console.log('Veritabanı bağlantısı sağlandı')
	} catch (error: any) {
		console.log('Veritabanı bağlantısı sağlanırken bir hata oluştu')
		throw new Error('Hata:', error)
	}
}

export default connect
