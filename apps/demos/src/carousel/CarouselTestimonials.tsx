import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@acronis-platform/shadcn-uikit/react'
import { Card, CardContent } from '@acronis-platform/shadcn-uikit/react'

export function CarouselTestimonials() {
  return (
    <Carousel className="w-full max-w-xl mx-auto">
      <CarouselContent>
        {[
          {
            quote: 'This product has completely transformed how we work!',
            author: 'John Doe',
            role: 'CEO, Company A',
          },
          {
            quote: 'Outstanding support and amazing features.',
            author: 'Jane Smith',
            role: 'CTO, Company B',
          },
          {
            quote: 'Best investment we made this year.',
            author: 'Bob Johnson',
            role: 'Manager, Company C',
          },
        ].map((testimonial, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
                  <p className="text-lg italic mb-4">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
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
