import { useState, useEffect } from 'react'
import type { Airline, CreateAirlineRequest } from '@/types/airline'

export default function Airlines() {
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAirline, setEditingAirline] = useState<Airline | null>(null)
  const [formData, setFormData] = useState<CreateAirlineRequest>({
    numeric_code: '',
    iata_code: '',
    name: '',
    country_code: '',
    active: true,
  })

  useEffect(() => {
    fetchAirlines()
  }, [])

  const fetchAirlines = async () => {
    try {
      const response = await fetch('/api/airlines')
      if (response.ok) {
        const data = await response.json()
        setAirlines(data)
      }
    } catch (error) {
      console.error('Error fetching airlines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAirline ? `/api/airlines/${editingAirline.id}` : '/api/airlines'
      const method = editingAirline ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchAirlines()
        setShowForm(false)
        setEditingAirline(null)
        setFormData({
          numeric_code: '',
          iata_code: '',
          name: '',
          country_code: '',
          active: true,
        })
      }
    } catch (error) {
      console.error('Error saving airline:', error)
    }
  }

  const handleEdit = (airline: Airline) => {
    setEditingAirline(airline)
    setFormData({
      numeric_code: airline.numeric_code,
      iata_code: airline.iata_code,
      name: airline.name,
      country_code: airline.country_code || '',
      active: airline.active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/airlines/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          await fetchAirlines()
        }
      } catch (error) {
        console.error('Error deleting airline:', error)
      }
    }
  }

  const handleCSVDownload = async () => {
    try {
      const response = await fetch('/api/airlines/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `airlines_${new Date().toISOString().slice(0, 10)}.csv`
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
          <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-xl">✈</span>
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
            <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <span className="text-white text-xl">✈️</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              항공사 관리
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCSVDownload}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center"
            >
              📄 CSV 다운로드
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-sky-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              + 항공사 추가
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl mb-8 border border-sky-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">{editingAirline ? '✏' : '+'}</span>
              </div>
              {editingAirline ? '항공사 수정' : '항공사 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">숫자 코드 (3자리)</label>
                <input
                  type="text"
                  value={formData.numeric_code}
                  onChange={(e) => setFormData({ ...formData, numeric_code: e.target.value })}
                  className="w-full p-3 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 text-slate-800 bg-white/80 transition-all duration-200"
                  pattern="[0-9]{3}"
                  maxLength={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">IATA 코드 (2자리)</label>
                <input
                  type="text"
                  value={formData.iata_code}
                  onChange={(e) => setFormData({ ...formData, iata_code: e.target.value.toUpperCase() })}
                  className="w-full p-3 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 text-slate-800 bg-white/80 transition-all duration-200"
                  pattern="[A-Z]{2}"
                  maxLength={2}
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold mb-2 text-slate-700">항공사명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 text-slate-800 bg-white/80 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">국가 코드 (2자리)</label>
                <input
                  type="text"
                  value={formData.country_code}
                  onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
                  className="w-full p-3 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 text-slate-800 bg-white/80 transition-all duration-200"
                  pattern="[A-Z]{2}"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">활성 상태</label>
                <select
                  value={formData.active ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                  className="w-full p-3 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 text-slate-800 bg-white/80 transition-all duration-200"
                >
                  <option value="true">활성</option>
                  <option value="false">비활성</option>
                </select>
              </div>
              <div className="col-span-2 flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  {editingAirline ? '✓ 수정하기' : '+ 추가하기'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAirline(null)
                    setFormData({
                      numeric_code: '',
                      iata_code: '',
                      name: '',
                      country_code: '',
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

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-sky-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-sky-500 to-blue-500">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    숫자 코드
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    IATA 코드
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    항공사명
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    국가
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-sky-100">
                {airlines.map((airline, index) => (
                  <tr key={airline.id} className={`hover:bg-sky-50/50 transition-colors ${index % 2 === 0 ? 'bg-white/30' : 'bg-sky-50/30'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                      {airline.numeric_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-sky-600">
                      {airline.iata_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                      {airline.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {airline.country_code || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          airline.active
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {airline.active ? '✓ 활성' : '✗ 비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(airline)}
                        className="text-sky-600 hover:text-sky-700 mr-4 font-semibold hover:underline transition-colors"
                      >
                        ✏ 수정
                      </button>
                      <button
                        onClick={() => handleDelete(airline.id)}
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
          {airlines.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-slate-400 text-2xl">✈</span>
              </div>
              <p className="text-slate-500 text-lg">등록된 항공사가 없습니다.</p>
              <p className="text-slate-400 text-sm mt-2">위의 '+ 항공사 추가' 버튼을 클릭해서 새로운 항공사를 등록해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}