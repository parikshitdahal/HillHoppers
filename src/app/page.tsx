'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MapPinned, MessageCircleMore, Sparkles, Star } from 'lucide-react'
import { destinationData } from '@/app/data/destinations'
import { packages } from '@/app/data/packages'
import PackageCard from '@/app/components/PackageCard'

const heroSlides = [
  { src: '/destinations/gtk.jpg', position: 'center 56%' },
  { src: '/destinations/temi.jpg', position: 'center 52%' },
  { src: '/destinations/gangtok.jpg', position: 'center 48%' },
  { src: '/destinations/east.jpg', position: 'center 52%' },
]

const travellerMoments = [
  { src: '/gallery/north1.jpg', title: 'North Sikkim mornings', location: 'Lachen and Lachung route' },
  { src: '/gallery/south1.jpg', title: 'Slow southern views', location: 'Namchi and Ravangla' },
  { src: '/gallery/west1.jpg', title: 'West Sikkim stories', location: 'Pelling and Yuksom' },
  { src: '/destinations/temi.jpg', title: 'Tea garden pauses', location: 'Temi and nearby valleys' },
]

const testimonials = [
  {
    name: 'Aarav Mehta',
    trip: 'North Sikkim Circuit',
    quote:
      'From the first conversation, the planning felt measured and thoughtful. The route flowed beautifully, and the mountain days never felt hurried.',
  },
  {
    name: 'Sneha Gurung',
    trip: 'Custom Family Journey',
    quote:
      'We wanted a family-friendly version of Sikkim with a gentler pace, and the team shaped it with real care. The stay recommendations were especially well judged.',
  },
  {
    name: 'Ritika Sharma',
    trip: 'Complete Sikkim Tour',
    quote:
      'The journey felt polished without becoming rigid. We had memorable local experiences, excellent views, and seamless coordination throughout.',
  },
]

type AutoScrollShowcaseProps<T> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  getKey: (item: T, index: number) => string
  intervalMs?: number
}

function AutoScrollShowcase<T>({
  items,
  renderItem,
  getKey,
  intervalMs = 5000,
}: AutoScrollShowcaseProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (items.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % items.length)
    }, intervalMs)

    return () => clearInterval(interval)
  }, [items.length, intervalMs])

  useEffect(() => {
    const container = containerRef.current
    const activeCard = cardRefs.current[activeIndex]

    if (container && activeCard) {
      container.scrollTo({
        left: activeCard.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      })
    }
  }, [activeIndex])

  return (
    <div>
      <div
        ref={containerRef}
        className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-4"
      >
        {items.map((item, index) => (
          <div
            key={getKey(item, index)}
            ref={(node) => {
              cardRefs.current[index] = node
            }}
            className="w-[86%] shrink-0 snap-start sm:w-[48%] lg:w-[31.5%]"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={`${getKey(item, index)}-dot`}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? 'w-8 bg-[var(--accent-deep)]' : 'w-2.5 bg-[rgba(95,116,140,0.28)]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function HomeDestinationCard({
  destination,
}: {
  destination: {
    name: string
    media: { type: 'image' | 'video'; src: string }
    district: string
  }
}) {
  return (
    <div className="immersive-card group h-full">
      <div className="relative h-[430px]">
        {destination.media.type === 'video' ? (
          <video
            src={destination.media.src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={destination.media.src}
            alt={destination.name}
            width={1000}
            height={1200}
            quality={95}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        <div className="absolute inset-0 immersive-overlay" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h3 className="text-2xl font-semibold leading-tight">{destination.name}</h3>
            <Link href={`/destinations/${destination.district}`} className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--text-dark)] transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100">
              Explore <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
  )
}

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Extract top destination from each district (or first 3 total if needed)
  const topDestinations = destinationData.flatMap(d =>
    d.destinations.length
      ? [{ ...d.destinations[0], district: d.district }]
      : []
  )

  const featuredPackages = packages

  return (
    <div className="bg-page">
      {/* Hero Section */}
      <section className="luxury-grid relative flex min-h-[88vh] items-end overflow-hidden px-4 pb-14 pt-28 text-white sm:px-6 sm:pb-18 sm:pt-32">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt=""
              fill
              priority={index === 0}
              quality={95}
              sizes="100vw"
              className={`object-cover transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
              style={{ objectPosition: slide.position }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,20,0.28),rgba(4,11,20,0.74))]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(4,11,20,0),rgba(4,11,20,0.56))]" />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="max-w-3xl">
          <div className="mb-4 inline-flex rounded-full border border-[rgba(84,215,255,0.24)] bg-[rgba(7,16,26,0.44)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent)] backdrop-blur-md">
            Curated journeys through Sikkim
          </div>
          <div className="hero-panel rounded-[2rem] p-8 text-center sm:p-10 sm:text-left">
            <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Explore the Eastern Himalayas with greater ease, depth, and style
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Discover thoughtfully planned mountain journeys, carefully chosen stays, and flexible travel design shaped around what you most want to experience.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <Link
                href="/destinations"
                className="btn-brand inline-block rounded-full px-6 py-3 font-semibold transition"
              >
                Explore Destinations
              </Link>
              <Link
                href="/custom-package"
                className="btn-secondary inline-block rounded-full px-6 py-3 font-semibold transition"
              >
                Build a Custom Trip
              </Link>
            </div>
            <div className="glass-strip mt-8 grid max-w-3xl gap-4 rounded-[1.5rem] p-4 text-left sm:grid-cols-3">
              <div className="rounded-xl border border-[rgba(17,24,39,0.06)] bg-white/88 p-4">
                <p className="text-2xl font-black text-[var(--text-dark)]">4+</p>
                <p className="text-sm text-[var(--muted)]">Signature regional circuits</p>
              </div>
              <div className="rounded-xl border border-[rgba(17,24,39,0.06)] bg-white/88 p-4">
                <p className="text-2xl font-black text-[var(--text-dark)]">Tailored</p>
                <p className="text-sm text-[var(--muted)]">Travel planning around dates, pace, and stay style</p>
              </div>
              <div className="rounded-xl border border-[rgba(17,24,39,0.06)] bg-white/88 p-4">
                <p className="text-2xl font-black text-[var(--text-dark)]">Local</p>
                <p className="text-sm text-[var(--muted)]">Ground-aware planning shaped by regional knowledge</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="mb-10 flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="eyebrow mb-3">Featured Packages</p>
            <h2 className="section-title text-3xl">Begin with a route already shaped to travel well</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              Explore a few of our signature itineraries, then enquire with your dates and preferences so we can recommend the right fit. The cards move gently so you can browse more without leaving the page.
            </p>
          </div>
          <Link href="/packages" className="link-brand text-sm font-semibold">
            See all packages →
          </Link>
        </div>
        <AutoScrollShowcase
          items={featuredPackages}
          getKey={(pkg) => pkg.id}
          renderItem={(pkg) => <PackageCard pkg={pkg} />}
        />
      </section>

      {/* Popular Destinations Section */}
      <section className="landing-section">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Most Loved Places</p>
          <h2 className="section-title text-3xl">Places Travellers Return To Again And Again</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Browse the regions and highlights that shape some of the most rewarding journeys across Sikkim, Darjeeling, Kalimpong, and the Dooars.
          </p>
        </div>
        <AutoScrollShowcase
          items={topDestinations}
          getKey={(dest) => `${dest.district}-${dest.name}`}
          renderItem={(dest) => <HomeDestinationCard destination={dest} />}
        />
        <div className="mt-8 text-center">
          <Link href="/destinations" className="btn-secondary inline-block rounded-full px-6 py-3 font-semibold">
            Browse All Regions
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card-shell rounded-[1.8rem] p-8">
            <p className="eyebrow mb-3">Custom Planning</p>
            <h2 className="section-title text-3xl">Prefer a journey shaped around your own brief?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              If you already know the regions, dates, or stay style you prefer, we can shape an itinerary that feels far more personal than a fixed route.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[rgba(17,24,39,0.06)] bg-white/88 p-4">
                <MapPinned className="icon-accent-gold mb-3" />
                <p className="text-sm font-semibold text-[var(--text-dark)]">Select your regions</p>
              </div>
              <div className="rounded-[1.2rem] border border-[rgba(17,24,39,0.06)] bg-white/88 p-4">
                <Sparkles className="icon-accent-sage mb-3" />
                <p className="text-sm font-semibold text-[var(--text-dark)]">Choose your stay style</p>
              </div>
              <div className="rounded-[1.2rem] border border-[rgba(17,24,39,0.06)] bg-white/88 p-4">
                <MessageCircleMore className="mb-3 text-[var(--accent-deep)]" />
                <p className="text-sm font-semibold text-[var(--text-dark)]">Receive a tailored plan</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/custom-package" className="btn-brand inline-block rounded-full px-6 py-3 font-semibold">
                Start Customizing
              </Link>
              <Link href="/contacts" className="btn-secondary inline-block rounded-full px-6 py-3 font-semibold">
                Talk To Us First
              </Link>
            </div>
          </div>
          <div className="bg-brand-dark rounded-[1.8rem] p-8 text-white shadow-[0_28px_70px_rgba(15,34,52,0.18)]">
            <p className="eyebrow mb-3 text-[var(--accent)]">Why This Works</p>
            <h3 className="text-2xl font-bold">A clearer way to begin planning well</h3>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              Start with a package, explore by region, or send us a custom brief. The aim is to make the planning process feel calm, clear, and flexible from the outset.
            </p>
            <div className="mt-8 space-y-4 text-sm leading-6 text-slate-200">
              <div className="rounded-xl border border-[rgba(201,162,79,0.18)] bg-[rgba(255,248,231,0.1)] p-4">Begin with the regions and experiences you already know matter to you.</div>
              <div className="rounded-xl border border-[rgba(111,156,134,0.2)] bg-[rgba(238,246,240,0.08)] p-4">Share your dates, pace, and stay preferences so the route feels properly considered.</div>
            </div>
          </div>
        </div>
      </section>


      <section className="landing-section">
        <div className="mb-10 flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="eyebrow mb-3">Traveller Gallery</p>
            <h2 className="section-title text-3xl">Real moments from journeys we help shape</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              A soft look at the kind of memories guests share after their trips. Soon, this section can feature approved client photos and feedback directly from the new feedback form.
            </p>
          </div>
          <Link href="/contacts" className="link-brand text-sm font-semibold">
            Share your feedback →
          </Link>
        </div>
        <AutoScrollShowcase
          items={travellerMoments}
          intervalMs={4200}
          getKey={(moment) => moment.src}
          renderItem={(moment) => (
            <div className="immersive-card group h-full">
              <div className="relative h-[360px]">
                <Image
                  src={moment.src}
                  alt={moment.title}
                  width={900}
                  height={1100}
                  quality={95}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 immersive-overlay" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="mb-3 flex items-center gap-1 text-[var(--gold)]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <h3 className="text-2xl font-semibold leading-tight">{moment.title}</h3>
                  <p className="mt-2 text-sm text-slate-100">{moment.location}</p>
                </div>
              </div>
            </div>
          )}
        />
      </section>

      <section className="landing-section pb-24">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Guest Feedback</p>
          <h2 className="section-title text-3xl">What our guests say about travelling with us</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="card-shell rounded-[1.5rem] p-6">
              <div className="mb-4 flex items-center gap-1 text-[var(--gold)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-7 text-[var(--foreground)]">“{item.quote}”</p>
              <div className="mt-6 border-t border-[var(--border)] pt-4">
                <p className="font-semibold text-primary">{item.name}</p>
                <p className="text-sm text-[var(--muted)]">{item.trip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
