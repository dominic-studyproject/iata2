import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">✈</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-6">
            IATA 코드 관리 시스템
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            국제 운송협회(IATA) 코드를 효율적으로 관리하는 모던 어드민 시스템
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Link href="/airlines">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-sky-100 hover:border-sky-200 hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">✈️</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 ml-4">
                  항공사 관리
                </h2>
              </div>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                항공사의 숫자코드(3자리)와 IATA 코드(2자리)를 체계적으로 관리하고 조회할 수 있습니다.
              </p>
              <div className="flex items-center text-sky-600 font-semibold text-lg group-hover:text-sky-700 transition-colors">
                관리하기 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/airports">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-sky-100 hover:border-sky-200 hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🏢</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 ml-4">
                  공항 관리
                </h2>
              </div>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                전 세계 공항의 IATA 코드와 ICAO 코드, 위치 정보를 통합 관리합니다.
              </p>
              <div className="flex items-center text-emerald-600 font-semibold text-lg group-hover:text-emerald-700 transition-colors">
                관리하기 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-sky-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">ℹ</span>
            </div>
            시스템 정보
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">프레임워크</span>
              <span className="text-sky-600 font-medium">Next.js 15.3.4</span>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">데이터베이스</span>
              <span className="text-emerald-600 font-medium">Supabase</span>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">언어</span>
              <span className="text-purple-600 font-medium">TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
