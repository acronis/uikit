import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@acronis-platform/shadcn-uikit/react'
import { Card, CardContent } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@acronis-platform/shadcn-uikit'
export function CarouselFigmaStyle() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const isFirst = current === 0
  const isLast = current === count - 1

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-5xl mb-2">📄</div>
                    <p className="text-sm text-gray-600">Step {index + 1}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center justify-between">
        <button
          onClick={() => api?.scrollPrev()}
          disabled={isFirst}
          className={`text-sm font-semibold py-1 transition-colors ${
            isFirst
              ? 'text-[hsl(var(--carousel-nav-text-disabled)/0.3)] cursor-not-allowed'
              : 'text-[hsl(var(--carousel-nav-text))] hover:opacity-80'
          }`}
        >
          <ChevronLeftIcon className="inline h-4 w-4" /> Prev
        </button>

        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === current
                  ? 'bg-[hsl(var(--carousel-dot-active))]'
                  : 'bg-[hsl(var(--carousel-dot)/0.3)]'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => api?.scrollNext()}
          disabled={isLast}
          className={`text-sm font-semibold py-1 transition-colors ${
            isLast
              ? 'text-[hsl(var(--carousel-nav-text-disabled)/0.3)] cursor-not-allowed'
              : 'text-[hsl(var(--carousel-nav-text))] hover:opacity-80'
          }`}
        >
          Next <ChevronRightIcon className="inline h-4 w-4" />
        </button>
      </div>

      {isLast && (
        <div className="space-y-2">
          <Button className="w-full bg-[hsl(var(--carousel-button-bg))] text-[hsl(var(--carousel-button-text))] hover:opacity-90">
            Protect devices
          </Button>
          <Button variant="ghost" className="w-full text-[hsl(var(--carousel-nav-text))]">
            Go back
          </Button>
        </div>
      )}
    </div>
  )
}
