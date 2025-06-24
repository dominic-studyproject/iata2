import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabase
      .from('airlines')
      .select('*')
      .order('name')

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // CSV 헤더 생성
    const headers = [
      'ID',
      '숫자코드',
      'IATA코드', 
      '항공사명',
      '국가코드',
      '활성상태',
      '생성일',
      '수정일'
    ]

    // CSV 데이터 생성
    const csvRows = [
      headers.join(','),
      ...data.map(airline => [
        airline.id,
        airline.numeric_code,
        airline.iata_code,
        `"${airline.name}"`, // 이름에 쉼표가 있을 수 있으므로 따옴표로 감쌈
        airline.country_code || '',
        airline.active ? '활성' : '비활성',
        new Date(airline.created_at).toLocaleString('ko-KR'),
        new Date(airline.updated_at).toLocaleString('ko-KR')
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')

    // CSV 파일로 다운로드 설정
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `airlines_${timestamp}.csv`

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Cache-Control', 'no-cache')

    // UTF-8 BOM 추가 (엑셀에서 한글 깨짐 방지)
    const bom = '\uFEFF'
    return res.status(200).send(bom + csvContent)

  } catch (error) {
    console.error('CSV export error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}