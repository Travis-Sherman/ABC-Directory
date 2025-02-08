"use client"

import { useState, useEffect, useRef } from "react"
import { useUser, SignInButton, useClerk } from "@clerk/nextjs"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Pencil, LogIn, LogOut, Plus, Trash2, Upload, Check, X, Share } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FaDiscord, FaLinkedin, FaTelegram, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa"
import { Role, ROLE_COLORS } from "@/app/types"

interface Link {
  name: string
  url: string
  icon?: JSX.Element
}

interface Socials {
  telegram?: string
  discord?: string
  twitter?: string
  linkedin?: string
  farcaster?: string
}

interface Profile {
  name: string
  bio: string
  links: Link[]
  socials: Socials
  profileImage: string
  roles?: Role[]
  ticker?: string
}

const DEFAULT_LINKS = [
  { name: "Site", url: "", icon: <FaGlobe className="w-4 h-4" /> },
  { name: "GitHub", url: "", icon: <FaGithub className="w-4 h-4" /> }
]

const DEFAULT_PROFILE: Profile = {
  name: "",
  bio: "",
  links: DEFAULT_LINKS,
  socials: {
    telegram: "",
    discord: "",
    twitter: "",
    linkedin: "",
    farcaster: ""
  },
  profileImage: "",
  roles: [],
  ticker: ""
}

const getBuilderShareUrl = (userId: string) => {
  // Use the profile dynamic route instead of builders
  return `${window.location.origin}/profile/${userId}`;
};

// Add this constant to group the exclusive roles
const EXCLUSIVE_ROLES = [Role.AGENTS, Role.LIVE, Role.PLAY, Role.WORK];

// Add Farcaster icon component
const Farcaster = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M18.24.24H5.76A5.76 5.76 0 0 0 0 6v12a5.76 5.76 0 0 0 5.76 5.76h12.48A5.76 5.76 0 0 0 24 18V6A5.76 5.76 0 0 0 18.24.24m.816 17.166v.504a.49.49 0 0 1 .543.48v.568h-5.143v-.569A.49.49 0 0 1 15 17.91v-.504c0-.22.153-.402.358-.458l-.01-4.364c-.158-1.737-1.64-3.098-3.443-3.098s-3.285 1.361-3.443 3.098l-.01 4.358c.228.042.532.208.54.464v.504a.49.49 0 0 1 .543.48v.568H4.392v-.569a.49.49 0 0 1 .543-.479v-.504c0-.253.201-.454.454-.472V9.039h-.49l-.61-2.031H6.93V5.042h9.95v1.966h2.822l-.61 2.03h-.49v7.896c.252.017.453.22.453.472"></path>
  </svg>
)

export default function ProfilePage() {
  const router = useRouter()
  const clerk = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const currentPath = window.location.pathname
      router.push(`/login?redirect_url=${encodeURIComponent(currentPath)}`)
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return

      try {
        const res = await fetch(`/api/profile/${user.id}`)
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json()
        setProfile({
          ...DEFAULT_PROFILE,
          ...data,
          name: data?.name || user.firstName || "",
          profileImage: data?.profileImage || user.imageUrl || "",
          links: data?.links || DEFAULT_LINKS,
          socials: {
            ...DEFAULT_PROFILE.socials,
            ...data?.socials
          },
          roles: data?.roles || [],
          ticker: data?.ticker || ""
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile')
      }
    }

    fetchProfile()
  }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to upload image')
      
      const blob = await res.json()
      setProfile({ ...profile, profileImage: blob.url })
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (!res.ok) throw new Error('Failed to update profile')
      
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await clerk.signOut()
      router.push('/')
    } catch {
      toast.error('Failed to log out')
    }
  }

  const removeLink = (index: number) => {
    const newLinks = profile.links.filter((_, i) => i !== index)
    setProfile({ ...profile, links: newLinks })
  }

  const handleShare = async () => {
    if (!user) return;
    
    try {
      const shareUrl = getBuilderShareUrl(user.id);
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to copy link');
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0052FF]"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pt-20 gap-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl font-bold text-[#0052FF]">
            Welcome to Your Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Please sign in to continue</p>
          <SignInButton mode="modal">
            <Button className="bg-[#0052FF] text-white hover:bg-[#0052FF]/90 transition-all duration-300 transform hover:scale-105">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </SignInButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8 sm:pt-12 pt-24 sm:pb-12 pb-32">
      <div className="max-w-4xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Action Buttons - Desktop above, Mobile below */}
          <div className="hidden sm:flex justify-between items-center gap-3 mb-6">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full px-6 py-2 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {!isEditing && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleShare}
                  className="bg-[#111111] text-white hover:bg-[#0052FF] rounded-full px-6 py-2 flex items-center gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#111111] text-white hover:bg-[#0052FF] rounded-full px-6 py-2 flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>

          <Card className="backdrop-blur-lg bg-white/80 dark:bg-black/50 shadow-xl rounded-2xl overflow-hidden border-0">
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-32 h-32 group"
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-[#0052FF]/20">
                      <Image
                        src={profile.profileImage || user?.imageUrl || "/placeholder.jpg"}
                        alt={profile.name || "Profile picture"}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                      {isEditing && (
                        <div 
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                          ) : (
                            <Upload className="h-6 w-6 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </motion.div>

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold mb-4">
                      {profile.name || user?.firstName}
                      {profile.ticker && profile.roles?.includes(Role.AGENTS) && (
                        <span className="ml-2 text-[#0052FF]">{profile.ticker}</span>
                      )}
                    </h2>
                    {isEditing ? (
                      <>
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="mb-4 rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                          placeholder="Your name"
                        />
                        <Textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="w-full rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all min-h-[100px]"
                          placeholder="Tell us about yourself..."
                        />
                      </>
                    ) : (
                      <>
                        {profile.roles && profile.roles.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {profile.roles.map((role) => (
                              <span
                                key={role}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role]}`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-gray-600 dark:text-gray-400">{profile.bio || "No bio yet"}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Profile Content */}
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Roles</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {Object.values(Role).map((role) => {
                            const isSelected = profile.roles?.includes(role)
                            return (
                              <button
                                key={role}
                                onClick={() => {
                                  const newRoles = profile.roles || []
                                  if (isSelected) {
                                    setProfile({
                                      ...profile,
                                      roles: newRoles.filter(r => r !== role)
                                    })
                                  } else {
                                    // If the new role is in the exclusive group, remove any existing exclusive roles
                                    const filteredRoles = EXCLUSIVE_ROLES.includes(role)
                                      ? newRoles.filter(r => !EXCLUSIVE_ROLES.includes(r))
                                      : newRoles;
                                    
                                    setProfile({
                                      ...profile,
                                      roles: [...filteredRoles, role]
                                    })
                                  }
                                }}
                                type="button"
                                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  isSelected
                                    ? ROLE_COLORS[role] + " ring-2 ring-[#0052FF]"
                                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                              >
                                {role}
                                {isSelected ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <X className="w-4 h-4 opacity-0 group-hover:opacity-50" />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {profile.roles?.includes(Role.AGENTS) && (
                        <div className="mt-4">
                          <label className="block text-xs text-gray-500 mb-1">Ticker Symbol ($)</label>
                          <Input
                            value={profile.ticker}
                            onChange={(e) => setProfile({
                              ...profile,
                              ticker: e.target.value.startsWith('$') ? e.target.value : `$${e.target.value}`
                            })}
                            placeholder="$TICK"
                            className="rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-2">Social Links</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Telegram</label>
                            <Input
                              value={profile.socials.telegram}
                              onChange={(e) => setProfile({
                                ...profile,
                                socials: { ...profile.socials, telegram: e.target.value }
                              })}
                              placeholder="https://t.me/..."
                              className="rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Discord</label>
                            <Input
                              value={profile.socials.discord}
                              onChange={(e) => setProfile({
                                ...profile,
                                socials: { ...profile.socials, discord: e.target.value }
                              })}
                              placeholder="Your Discord username"
                              className="rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Twitter</label>
                            <Input
                              value={profile.socials.twitter}
                              onChange={(e) => setProfile({
                                ...profile,
                                socials: { ...profile.socials, twitter: e.target.value }
                              })}
                              placeholder="https://twitter.com/..."
                              className="rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                            <Input
                              value={profile.socials.linkedin}
                              onChange={(e) => setProfile({
                                ...profile,
                                socials: { ...profile.socials, linkedin: e.target.value }
                              })}
                              placeholder="https://linkedin.com/in/..."
                              className="rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Farcaster</label>
                            <Input
                              value={profile.socials.farcaster}
                              onChange={(e) => setProfile({
                                ...profile,
                                socials: { ...profile.socials, farcaster: e.target.value }
                              })}
                              placeholder="Your Farcaster handle"
                              className="rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Links</label>
                        <div className="space-y-3">
                          {profile.links.map((link, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex gap-3 items-center"
                            >
                              <Input
                                value={link.name}
                                onChange={(e) => {
                                  const newLinks = [...profile.links]
                                  newLinks[index].name = e.target.value
                                  setProfile({ ...profile, links: newLinks })
                                }}
                                placeholder="Link Name"
                                className="w-1/3 rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                              />
                              <Input
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = [...profile.links]
                                  newLinks[index].url = e.target.value
                                  setProfile({ ...profile, links: newLinks })
                                }}
                                placeholder="https://..."
                                className="w-2/3 rounded-xl bg-white/5 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#0052FF] transition-all"
                              />
                              {index >= DEFAULT_LINKS.length && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeLink(index)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </motion.div>
                          ))}
                          <Button
                            type="button"
                            onClick={() => setProfile({ ...profile, links: [...profile.links, { name: "", url: "" }] })}
                            variant="outline"
                            className="w-full mt-2 rounded-xl border-dashed border-2 hover:border-[#0052FF] transition-all"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add Custom Link
                          </Button>
                        </div>
                      </div>

                      {/* Edit Mode Buttons */}
                      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <Button
                          onClick={() => setIsEditing(false)}
                          className="bg-black text-white hover:bg-black/90 rounded-xl px-8 py-2"
                          disabled={isLoading}
                        >
                          Discard
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          className="bg-black text-white hover:bg-black/90 rounded-xl px-8 py-2"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              Saving...
                            </div>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Default Links */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.links.slice(0, 2).map((link, index) => (
                          link.url ? (
                            <motion.a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 rounded-xl bg-[#0052FF]/5 hover:bg-[#0052FF]/10 dark:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 group"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="p-2 rounded-lg bg-[#0052FF]/10 text-[#0052FF]">
                                {DEFAULT_LINKS[index].icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#0052FF]">
                                  {link.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {link.url}
                                </div>
                              </div>
                            </motion.a>
                          ) : null
                        ))}
                      </div>

                      {/* Social Links */}
                      {profile.socials && Object.values(profile.socials).some(value => value) && (
                        <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 space-y-4">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Social Links</h3>
                          <div className="flex flex-wrap gap-3">
                            {profile.socials.telegram && (
                              <a
                                href={profile.socials.telegram.startsWith('http') ? profile.socials.telegram : `https://t.me/${profile.socials.telegram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                              >
                                <FaTelegram className="w-5 h-5" />
                              </a>
                            )}
                            {profile.socials.discord && (
                              <a
                                href={profile.socials.discord.startsWith('http') ? profile.socials.discord : `discord://-/users/${profile.socials.discord}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                              >
                                <FaDiscord className="w-5 h-5" />
                              </a>
                            )}
                            {profile.socials.twitter && (
                              <a
                                href={profile.socials.twitter.startsWith('http') ? profile.socials.twitter : `https://twitter.com/${profile.socials.twitter.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                              >
                                <FaTwitter className="w-5 h-5" />
                              </a>
                            )}
                            {profile.socials.linkedin && (
                              <a
                                href={profile.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                              >
                                <FaLinkedin className="w-5 h-5" />
                              </a>
                            )}
                            {profile.socials.farcaster && (
                              <a
                                href={`https://warpcast.com/${profile.socials.farcaster.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 text-gray-600 hover:text-[#0052FF] dark:text-gray-400"
                              >
                                <Farcaster className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Custom Links */}
                      {profile.links.slice(2).some(link => link.name && link.url) && (
                        <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 space-y-4">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Other Links</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {profile.links.slice(2).map((link, index) => (
                              link.name && link.url ? (
                                <motion.a
                                  key={index}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-col p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 hover:bg-[#0052FF]/10 dark:hover:bg-[#0052FF]/20 transition-all duration-300 group"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#0052FF]">
                                    {link.name}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {link.url}
                                  </span>
                                </motion.a>
                              ) : null
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons - Mobile only */}
          <div className="sm:hidden flex flex-col gap-3 mt-12">
            {!isEditing && (
              <>
                <Button
                  onClick={handleShare}
                  className="bg-[#111111] text-white hover:bg-[#0052FF] rounded-full px-6 py-2 flex items-center justify-center gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#111111] text-white hover:bg-[#0052FF] rounded-full px-6 py-2 flex items-center justify-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              </>
            )}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full px-6 py-2 flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 
