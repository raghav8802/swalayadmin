import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function Component() {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4">
          <Image
            src="/placeholder.svg"
            alt="Album Cover"
            width={200}
            height={200}
            className="rounded-lg shadow-lg"
            style={{ aspectRatio: "200/200", objectFit: "cover" }}
          />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Cosmic Harmony</h2>
            <p className="text-muted-foreground">by Stellar Soundscapes</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 justify-center">
        <Link href="#" className="flex items-center gap-4 justify-center" prefetch={false}>
          <Image
            src="/placeholder.svg"
            alt="Spotify"
            width={40}
            height={40}
            className="rounded-full"
            style={{ aspectRatio: "40/40", objectFit: "cover" }}
          />
          <span className="text-sm font-medium">Spotify</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 justify-center" prefetch={false}>
          <Image
            src="/placeholder.svg"
            alt="Apple Music"
            width={40}
            height={40}
            className="rounded-full"
            style={{ aspectRatio: "40/40", objectFit: "cover" }}
          />
          <span className="text-sm font-medium">Apple Music</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 justify-center" prefetch={false}>
          <Image
            src="/placeholder.svg"
            alt="YouTube Music"
            width={40}
            height={40}
            className="rounded-full"
            style={{ aspectRatio: "40/40", objectFit: "cover" }}
          />
          <span className="text-sm font-medium">YouTube Music</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 justify-center" prefetch={false}>
          <Image
            src="/placeholder.svg"
            alt="Amazon Music"
            width={40}
            height={40}
            className="rounded-full"
            style={{ aspectRatio: "40/40", objectFit: "cover" }}
          />
          <span className="text-sm font-medium">Amazon Music</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 justify-center" prefetch={false}>
          <Image
            src="/placeholder.svg"
            alt="Bandcamp"
            width={40}
            height={40}
            className="rounded-full"
            style={{ aspectRatio: "40/40", objectFit: "cover" }}
          />
          <span className="text-sm font-medium">Bandcamp</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 justify-center" prefetch={false}>
          <Image
            src="/placeholder.svg"
            alt="SoundCloud"
            width={40}
            height={40}
            className="rounded-full"
            style={{ aspectRatio: "40/40", objectFit: "cover" }}
          />
          <span className="text-sm font-medium">SoundCloud</span>
        </Link>
      </div>
    </div>
  )
}