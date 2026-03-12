import React from "react"
import * as Icons from "lucide-react"

interface Props {
  name?: string | null
  size?: number
  className?: string
}

// Detect nếu string là emoji
const isEmoji = (str: string) => /\p{Emoji_Presentation}/u.test(str)

const CategoryIcon: React.FC<Props> = ({ name, size = 18, className }) => {
  const Fallback = Icons.Tag

  if (!name) {
    return <Fallback size={size} className={className} />
  }

  // Emoji → render trực tiếp
  if (isEmoji(name)) {
    return <span style={{ fontSize: size, lineHeight: 1 }}>{name}</span>
  }

  // Tên Lucide icon → tìm trong Icons
  const Icon = (Icons as any)[name] as React.FC<{ size?: number; className?: string }>

  if (!Icon) {
    return <Fallback size={size} className={className} />
  }

  return <Icon size={size} className={className} />
}

export default CategoryIcon