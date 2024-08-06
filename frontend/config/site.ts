export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: 'Attestation',
      href: '/create-attestation'
    }
  ],
  links: {
    twitter: "https://twitter.com/0xkamal7",
    docs: "https://ui.shadcn.com",
  },
  crosspayaddress: "0x6328a8e5529dd322A5583b5EEFfc48a2dc2c3A0f"
}
