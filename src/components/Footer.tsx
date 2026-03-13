import { Mail, MapPin, Youtube, Linkedin } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Footer = () => {
  const { lang, t } = useI18n();

  return (
    <footer className="pt-16 pb-8" style={{ background: 'hsl(0, 0%, 0%)', color: 'hsl(0, 0%, 90%)' }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <span className="text-lg font-bold">VivaEvent <span className="text-primary">AI</span></span>
            </div>
            <p className="text-sm" style={{ color: 'hsl(0, 0%, 70%)' }}>
              {t.footer.description[lang]}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.product[lang]}</h3>
            <ul className="space-y-3 text-sm" style={{ color: 'hsl(0, 0%, 70%)' }}>
              <li><a href="#features" className="transition-colors hover:brightness-125">{t.footer.features[lang]}</a></li>
              <li><a href="#come-funziona" className="transition-colors hover:brightness-125">{t.footer.howItWorks[lang]}</a></li>
              <li><a href="#pricing" className="transition-colors hover:brightness-125">{t.footer.pricing[lang]}</a></li>
              <li><a href="#" className="transition-colors hover:brightness-125">{t.footer.roadmap[lang]}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.resources[lang]}</h3>
            <ul className="space-y-3 text-sm" style={{ color: 'hsl(0, 0%, 70%)' }}>
              <li><a href="#" className="transition-colors hover:brightness-125">{t.footer.blog[lang]}</a></li>
              <li><a href="#" className="transition-colors hover:brightness-125">{t.footer.guides[lang]}</a></li>
              <li><a href="#" className="transition-colors hover:brightness-125">{t.footer.community[lang]}</a></li>
              <li><a href="#" className="transition-colors hover:brightness-125">{t.footer.support[lang]}</a></li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.followUs[lang]}</h3>
            <div className="flex gap-4">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" style={{ color: 'hsl(0, 0%, 70%)' }}>
                <Youtube className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" style={{ color: 'hsl(0, 0%, 70%)' }}>
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.contacts[lang]}</h3>
            <ul className="space-y-3 text-sm" style={{ color: 'hsl(0, 0%, 70%)' }}>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@royaltycheckai.com" className="transition-colors hover:brightness-125">info@royaltycheckai.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Roma, Italia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8" style={{ borderTop: '1px solid hsl(0, 0%, 20%)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: 'hsl(0, 0%, 60%)' }}>
            <p>© 2025 VivaEvent AI. {t.footer.rights[lang]}</p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:brightness-125">{t.footer.privacy[lang]}</a>
              <a href="#" className="transition-colors hover:brightness-125">{t.footer.terms[lang]}</a>
              <a href="#" className="transition-colors hover:brightness-125">{t.footer.cookies[lang]}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
