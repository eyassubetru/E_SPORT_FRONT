import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

const Sponsor = () => {
    const sponsors = [
        {
            name: "eReceipt",
            image: '/eReceipt.png',
            link: '#',
            backgroundImage: "/ereceiptBackground.jpeg",
            description: "Revolutionizing digital receipts and transaction management",
            tagline: "Smart Receipt Solutions"
        },
        {
            name: "Safe Transport",
            image: '/safe-logo.jpeg',
            backgroundImage: "/safeBackground.jpeg",
            description: "Ensuring secure and reliable transportation services",
            tagline: "Your Journey, Our Priority"
        },
        // Add more sponsors here
    ]

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length)
                setIsTransitioning(false)
            }, 300)
        }, 5000)

        return () => clearInterval(timer)
    }, [sponsors.length])

    const currentSponsor = sponsors[currentIndex]
    const nextSponsor = sponsors[(currentIndex + 1) % sponsors.length]

    return (
        <section className="relative w-full min-h-[500px] sm:min-h-[600px] overflow-hidden">
            
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
                {/* Current Background */}
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                        isTransitioning ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{
                        backgroundImage: `url('${currentSponsor.backgroundImage}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Next Background (preload) */}
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                        isTransitioning ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                        backgroundImage: `url('${nextSponsor.backgroundImage}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
                
                {/* Accent Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
            </div>

            {/* Content */}
            <div className="relative h-full min-h-[500px] sm:min-h-[600px] flex items-center">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full py-12 sm:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        
                        {/* Left Content */}
                        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                            
                            {/* Badge */}
                            <div className="inline-flex">
                                <div className="px-4 py-2 rounded-full border border-[#f6e925]/30 bg-[#f6e925]/10 backdrop-blur-sm">
                                    <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-[#f6e925]">
                                        Featured Partner
                                    </span>
                                </div>
                            </div>

                            {/* Tagline */}
                            <div className="space-y-2">
                                <p className="text-sm sm:text-base font-semibold uppercase tracking-wider text-slate-300">
                                    {currentSponsor.tagline}
                                </p>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                                    {currentSponsor.name}
                                </h2>
                            </div>

                            {/* Description */}
                            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-md">
                                {currentSponsor.description}
                            </p>



                            {/* Slide Indicators */}
                            <div className="flex gap-3 pt-4">
                                {sponsors.map((_, index) => (
                                    <div
                                        key={`indicator-${index}`}
                                        className={`transition-all duration-500 rounded-full ${
                                            index === currentIndex
                                                ? 'w-8 h-3 bg-[#f6e925]'
                                                : 'w-3 h-3 bg-slate-500'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Logo */}
                        <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end">
                            <div className="relative">
                                {/* Glow Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f6e925]/20 to-[#268dff]/20 rounded-2xl blur-3xl" />
                                
                                {/* Card */}
                                <div className="relative bg-gradient-to-br from-[#0c142b]/80 to-[#05091b]/80 backdrop-blur-xl border border-[#223457]/50 rounded-2xl p-8 sm:p-10">
                                    <div className="relative h-40 sm:h-48 w-48 sm:w-56 flex items-center justify-center">
                                        <img
                                            src={currentSponsor.image}
                                            alt={currentSponsor.name}
                                            className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-500 ${
                                                isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f6e925] to-transparent" />
        </section>
    )
}

export default Sponsor