import { Quote } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Testimonials = () => {
  const { lang, t } = useI18n();

  return (
    <section className="py-16 bg-background border-t border-border/20">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <Quote
          className="w-8 h-8 text-primary/40 mx-auto mb-6"
          style={{ filter: 'drop-shadow(0 0 10px hsl(195, 100%, 50%))' }}
        />
        <blockquote className="text-lg md:text-xl text-muted-foreground italic leading-relaxed mb-6">
          {t.testimonial.quote[lang]}
        </blockquote>
        <cite className="text-sm font-semibold text-foreground not-italic">
          {t.testimonial.author[lang]}
        </cite>
      </div>
    </section>
  );
};

export default Testimonials;
