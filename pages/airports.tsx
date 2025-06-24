import { useState, useEffect } from 'react'
import type { Airport, CreateAirportRequest } from '@/types/airport'

export default function Airports() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null)
  const [formData, setFormData] = useState<CreateAirportRequest>({
    iata_code: '',
    icao_code: '',
    name: '',
    city: '',
    country_code: '',
    latitude: undefined,
    longitude: undefined,
    elevation: undefined,
    timezone: '',
    active: true,
  })

  useEffect(() => {
    fetchAirports()
  }, [])

  const fetchAirports = async () => {
    try {
      const response = await fetch('/api/airports')
      if (response.ok) {
        const data = await response.json()
        setAirports(data)
      }
    } catch (error) {
      console.error('Error fetching airports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAirport ? `/api/airports/${editingAirport.id}` : '/api/airports'
      const method = editingAirport ? 'PUT' : 'POST'
      
      const submitData = {
        ...formData,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        elevation: formData.elevation || null,
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        await fetchAirports()
        setShowForm(false)
        setEditingAirport(null)
        setFormData({
          iata_code: '',
          icao_code: '',
          name: '',
          city: '',
          country_code: '',
          latitude: undefined,
          longitude: undefined,
          elevation: undefined,
          timezone: '',
          active: true,
        })
      }
    } catch (error) {
      console.error('Error saving airport:', error)
    }
  }

  const handleEdit = (airport: Airport) => {
    setEditingAirport(airport)
    setFormData({
      iata_code: airport.iata_code,
      icao_code: airport.icao_code || '',
      name: airport.name,
      city: airport.city,
      country_code: airport.country_code,
      latitude: airport.latitude || undefined,
      longitude: airport.longitude || undefined,
      elevation: airport.elevation || undefined,
      timezone: airport.timezone || '',
      active: airport.active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/airports/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          await fetchAirports()
        }
      } catch (error) {
        console.error('Error deleting airport:', error)
      }
    }
  }

  const handleCSVDownload = async () => {
    try {
      const response = await fetch('/api/airports/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `airports_${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading CSV:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-xl">🏢</span>
          </div>
          <p className="text-slate-600 text-lg">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-xl">🏢</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              공항 관리
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCSVDownload}
              className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-sky-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center"
            >
              📄 CSV 다운로드
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              + 공항 추가
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl mb-8 border border-emerald-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">{editingAirport ? '✏' : '+'}</span>
              </div>
              {editingAirport ? '공항 수정' : '공항 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">IATA 코드 (3자리)</label>
                <input
                  type="text"
                  value={formData.iata_code}
                  onChange={(e) => setFormData({ ...formData, iata_code: e.target.value.toUpperCase() })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                  pattern="[A-Z]{3}"
                  maxLength={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">ICAO 코드 (4자리)</label>
                <input
                  type="text"
                  value={formData.icao_code}
                  onChange={(e) => setFormData({ ...formData, icao_code: e.target.value.toUpperCase() })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                  pattern="[A-Z]{4}"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">국가 코드 (2자리)</label>
                <input
                  type="text"
                  value={formData.country_code}
                  onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                  pattern="[A-Z]{2}"
                  maxLength={2}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold mb-2 text-slate-700">공항명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">도시</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">위도</label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.latitude || ''}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">경도</label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.longitude || ''}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">고도 (미터)</label>
                <input
                  type="number"
                  value={formData.elevation || ''}
                  onChange={(e) => setFormData({ ...formData, elevation: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">시간대</label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                  placeholder="Asia/Seoul"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">활성 상태</label>
                <select
                  value={formData.active ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                  className="w-full p-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-slate-800 bg-white/80 transition-all duration-200"
                >
                  <option value="true">활성</option>
                  <option value="false">비활성</option>
                </select>
              </div>
              <div className="col-span-3 flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  {editingAirport ? '✓ 수정하기' : '+ 추가하기'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAirport(null)
                    setFormData({
                      iata_code: '',
                      icao_code: '',
                      name: '',
                      city: '',
                      country_code: '',
                      latitude: undefined,
                      longitude: undefined,
                      elevation: undefined,
                      timezone: '',
                      active: true,
                    })
                  }}
                  className="bg-gradient-to-r from-slate-400 to-slate-500 text-white px-6 py-3 rounded-xl hover:from-slate-500 hover:to-slate-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-500 to-teal-500">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    IATA
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    ICAO
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    공항명
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    도시
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    국가
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    위치
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-emerald-100">
                {airports.map((airport, index) => (
                  <tr key={airport.id} className={`hover:bg-emerald-50/50 transition-colors ${index % 2 === 0 ? 'bg-white/30' : 'bg-emerald-50/30'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                      {airport.iata_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                      {airport.icao_code || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                      {airport.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {airport.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {airport.country_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {airport.latitude && airport.longitude 
                        ? `${airport.latitude.toFixed(3)}, ${airport.longitude.toFixed(3)}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          airport.active
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {airport.active ? '✓ 활성' : '✗ 비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(airport)}
                        className="text-emerald-600 hover:text-emerald-700 mr-4 font-semibold hover:underline transition-colors"
                      >
                        ✏ 수정
                      </button>
                      <button
                        onClick={() => handleDelete(airport.id)}
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors"
                      >
                        🗑 삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {airports.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-slate-400 text-2xl">🏢</span>
              </div>
              <p className="text-slate-500 text-lg">등록된 공항이 없습니다.</p>
              <p className="text-slate-400 text-sm mt-2">위의 &#39;+ 공항 추가&#39; 버튼을 클릭해서 새로운 공항을 등록해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}