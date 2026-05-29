import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@acronis-platform/shadcn-uikit/react'
import { Card, CardContent } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

export function CarouselProducts() {
  return (
    <Carousel className="w-full max-w-md mx-auto">
      <CarouselContent>
        {[
          { name: 'Product 1', price: '$99', emoji: '💻' },
          { name: 'Product 2', price: '$149', emoji: '📱' },
          { name: 'Product 3', price: '$199', emoji: '⌚' },
          { name: 'Product 4', price: '$299', emoji: '🎧' },
        ].map((product, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="text-6xl mb-4">{product.emoji}</div>
                  <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                  <p className="text-2xl font-bold text-primary mb-4">{product.price}</p>
                  <Button className="w-full">Add to Cart</Button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
