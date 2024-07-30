
import { NextRequest , NextResponse } from 'next/server'
import { Web3Storage } from 'web3.storage'

function getAccessToken(): string {
  return process.env.WEB3STORAGE_TOKEN!
}

function makeStorageClient(): Web3Storage {
  return new Web3Storage({ token: getAccessToken() })
}

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    try {
      const storageClient = makeStorageClient()
      const { body } = await req.json()

      const file = new File([body], 'data.txt', { type: 'text/plain' })
      const cid = await storageClient.put([file])
      return NextResponse.json({cid})
      // res.status(200).json({ cid })
    } catch (error) {
      NextResponse.json({ error: 'Error storing data' })
      // res.status(500).json({ error: 'Error storing data' })
    }
  } else {
    NextResponse.json({ error: 'Only POST requests are allowed' })
    // res.status(405).json({ error: 'Only POST requests are allowed' })
  }
}
