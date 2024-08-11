export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Cross-Chain MerchantsPay",
  description: "Connecting merchants with customers , a payment infrastructure designed to make it easy for merchants to accept payments in any token on multiple chains",
  mainNav: [

  ],
  links: {
    twitter: "https://twitter.com/0xkamal7",
    docs: "https://ui.shadcn.com",
  },
  crosspayaddress: {
    84532: "0x28d0F2353af7e357Eed9f960D1D2213Fa85a270e", // Base Sepolia
    56: "0xc8E2B6AC668AC47ffE8814E86aDCb966C6AA3d5b", // Mode Sepolia
    11155420: "0x2AAC535db31DB35D13AECe36Ea7954A2089D55bE", // OP Sepolia
    2522: "0x301Ab38c7f652FA23C7Ba1fa182E36665Dac0fC2", // fRAXTAL Holesky
    1020: "0x2AAC535db31DB35D13AECe36Ea7954A2089D55bE" // Conduit Rollup
  }
}
