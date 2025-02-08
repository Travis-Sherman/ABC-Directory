export interface Link {
  name: string
  url: string
}

export interface Socials {
  farcaster: any
  telegram?: string
  discord?: string
  twitter?: string
  linkedin?: string
}

export enum Role {
  LIVE = "Live",
  PLAY = "Play",
  WORK = "Work",
  AGENTS = "Agents"
}

export const ROLE_COLORS: Record<Role, string> = {
  [Role.LIVE]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [Role.PLAY]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [Role.WORK]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [Role.AGENTS]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
}

export interface Builder {
  _id: string
  name: string
  bio: string
  profileImage?: string
  links: Link[]
  socials?: Socials
  userId: string
  roles?: Role[]  // Users can select multiple roles
} 
