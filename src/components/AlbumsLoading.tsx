import { Card, CardContent } from "@/components/ui/card"

export default function AlbumsLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="w-full h-16 bg-muted rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex flex-col gap-4 animate-pulse">
              <div className="w-full h-32 bg-muted rounded-lg mt-2" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded-lg" />
                <div className="h-4 w-2/3 bg-muted rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-3">
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg" />
          </div>


        </CardContent>
      </Card>


    </div>
  )
}
