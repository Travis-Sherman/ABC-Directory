"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import Image from "next/image"
import { UserCircle } from "lucide-react"
import { FaDiscord, FaGithub, FaGlobe, FaLinkedin, FaTelegram, FaTwitter } from "react-icons/fa"
import { Builder, ROLE_COLORS } from "@/app/types"
import { JSX, SVGProps } from "react"

// Add correct Farcaster icon component
const Farcaster = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M18.24.24H5.76A5.76 5.76 0 0 0 0 6v12a5.76 5.76 0 0 0 5.76 5.76h12.48A5.76 5.76 0 0 0 24 18V6A5.76 5.76 0 0 0 18.24.24m.816 17.166v.504a.49.49 0 0 1 .543.48v.568h-5.143v-.569A.49.49 0 0 1 15 17.91v-.504c0-.22.153-.402.358-.458l-.01-4.364c-.158-1.737-1.64-3.098-3.443-3.098s-3.285 1.361-3.443 3.098l-.01 4.358c.228.042.532.208.54.464v.504a.49.49 0 0 1 .543.48v.568H4.392v-.569a.49.49 0 0 1 .543-.479v-.504c0-.253.201-.454.454-.472V9.039h-.49l-.61-2.031H6.93V5.042h9.95v1.966h2.822l-.61 2.03h-.49v7.896c.252.017.453.22.453.472" />
  </svg>
)

export function BuilderCard({ builder }: { builder: Builder }) {
  // Ensure links array exists and has the required structure
  const links = builder.links || [
    { name: "Site", url: "" },
    { name: "GitHub", url: "" }
  ]

  // Ensure socials object exists with proper type checking
  const socials = builder.socials || { telegram: '', discord: '', twitter: '', linkedin: '', farcaster: '' }
  const telegram = socials.telegram
  const discord = socials.discord
  const twitter = socials.twitter
  const linkedin = socials.linkedin
  const farcaster = socials.farcaster

  return (
    <Link href={`/profile/${builder.userId}`}>
      <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 h-[260px] flex flex-col">
        <CardHeader className="flex flex-row items-start gap-4 flex-shrink-0 pb-0">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-2 ring-[#0052FF]/20">
            {builder.profileImage ? (
              <Image
                src={builder.profileImage}
                alt={builder.name || "Profile"}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{builder.name || "Anonymous Builder"}</h2>
            {builder.roles && builder.roles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 my-1">
                {builder.roles.map((role) => (
                  <span
                    key={role}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role]}`}
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {builder.bio || "No bio yet"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end pt-2 space-y-3">
          {/* Default Links */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {links.slice(0, 2).map((link, index) => (
              link?.url ? (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all group border border-gray-200 dark:border-gray-700"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(link.url, '_blank')
                  }}
                >
                  {index === 0 ? <FaGlobe className="w-4 h-4 text-[#0052FF]" /> : <FaGithub className="w-4 h-4 text-[#0052FF]" />}
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#0052FF] truncate">
                    {link.name || (index === 0 ? "Site" : "GitHub")}
                  </span>
                </a>
              ) : null
            ))}
          </div>

          {/* Social Links */}
          {Object.values(socials).some(value => value) && (
            <div className="flex justify-center gap-9 mb-2">
              {telegram && (
                <a
                  href={telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace('@', '')}`, '_blank')
                  }}
                >
                  <FaTelegram className="w-6 h-6" />
                </a>
              )}
              {discord && (
                <a
                  href={discord.startsWith('http') ? discord : `discord://-/users/${discord}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(discord.startsWith('http') ? discord : `discord://-/users/${discord}`, '_blank')
                  }}
                >
                  <FaDiscord className="w-6 h-6" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter.replace('@', '')}`, '_blank')
                  }}
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(linkedin, '_blank')
                  }}
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
              )}
              {farcaster && (
                <a
                  href={farcaster.startsWith('http') ? farcaster : `https://warpcast.com/${farcaster.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(farcaster.startsWith('http') ? farcaster : `https://warpcast.com/${farcaster.replace('@', '')}`, '_blank')
                  }}
                >
                  <Farcaster className="w-6 h-6" />
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 
