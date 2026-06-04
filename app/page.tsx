import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-16 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          CATATWA-LITE
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl">
          Catat Keuangan Cukup Seperti Chat WhatsApp
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-xl">
          Aplikasi pencatatan keuangan sederhana untuk UMKM Indonesia. 
          Cepat, mudah, dan tidak ribet.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/register">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8">
              Mulai Gratis
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Login
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Contoh Penggunaan</h2>
          <div className="text-left space-y-3">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-700">Ketik:</p>
              <p className="font-mono text-green-700">"jual kopi 2 40000"</p>
            </div>
            <div className="text-center text-gray-500" aria-hidden="true">↓</div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-700">Langsung jadi transaksi!</p>
              <p className="font-semibold text-green-600">+ Rp 40.000</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
