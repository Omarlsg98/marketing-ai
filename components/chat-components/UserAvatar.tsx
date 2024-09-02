import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface UserAvatarProps {
  userImage: string | null
  gradientClass?: string
}

export function UserAvatar({ userImage, gradientClass }: UserAvatarProps) {
  return (
    <Avatar className="h-10 w-10 flex-shrink-0">
      {userImage ? (
        <AvatarImage src={userImage} alt="User profile" />
      ) : (
        <AvatarFallback className={gradientClass}>
          {gradientClass ? '' : 'AI'}
        </AvatarFallback>
      )}
    </Avatar>
  )
}