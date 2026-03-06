import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Phone, MessageSquare } from "lucide-react";

const images = [
  { src: "/images/storefront.jpg", alt: "Setor Saúde storefront" },
  { src: "/images/counter2.jpg", alt: "Parapharmacy counter" },
  { src: "/images/consult-room.jpg", alt: "Consultation room" },
  { src: "/images/shelves1.jpg", alt: "Parapharmacy products" },
  { src: "/images/physio-room.jpg", alt: "Physiotherapy room" },
  { src: "/images/shelves2.jpg", alt: "Health products" },
  { src: "/images/reception.jpg", alt: "Reception area" },
  { src: "/images/counter1.jpg", alt: "Pharmacy counter" },
];

export default function Hero() {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const plugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    }),
  );

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleDotClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api],
  );

  return (
    <section className="relative bg-brand-accent flex flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-16 min-h-[85vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 mb-8"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-brand-primary mb-3">
          {t("welcome")}
          <br />
          <span className="text-brand-dark">Setor Saúde</span>
        </h1>
        <p className="text-lg md:text-xl text-brand-primary/80 font-medium mb-6">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="tel:+351914030944"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors shadow-lg"
          >
            <Phone className="h-4 w-4" />
            {t("bookNow")}
          </a>
          <a
            href="https://wa.me/351914030944"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#128C7E] transition-colors shadow-lg"
          >
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <Carousel
          opts={{
            loop: true,
            align: "start",
            containScroll: false,
            skipSnaps: false,
            duration: 50,
            startIndex: 0,
          }}
          plugins={[plugin.current]}
          setApi={setApi}
          className="relative"
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-[300px] sm:h-[400px] md:h-[450px] object-cover rounded-xl shadow-xl"
                    loading={index === 0 ? "eager" : "lazy"}
                    width={800}
                    height={450}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  current === index
                    ? "bg-brand-primary w-6"
                    : "bg-brand-primary/40"
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </motion.div>
    </section>
  );
}
