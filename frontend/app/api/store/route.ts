import { NextRequest, NextResponse } from "next/server"
import { PinataSDK } from "pinata"

const config = {
  api: {
    bodyParser: false,
  },
}

const pinata = new PinataSDK({
  pinataJwt: `${process.env.NEXT_PUBLIC_APP_PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_APP_GATEWAY_URL}`,
})

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    try {
      const { data } = await req.json()

      const file = new File([data], "data.txt", { type: "text/plain" })
      const upload = await pinata.upload.file(file)

      return NextResponse.json({ cid: upload.IpfsHash }, { status: 200 })
      // res.status(200).json({ cid })
    } catch (error) {
      console.log("Error >>>", error)

      NextResponse.json({ error: "Error storing data" })
      // res.status(500).json({ error: 'Error storing data' })
    }
  } else {
    NextResponse.json({ error: "Only POST requests are allowed" })
    // res.status(405).json({ error: 'Only POST requests are allowed' })
  }
}
