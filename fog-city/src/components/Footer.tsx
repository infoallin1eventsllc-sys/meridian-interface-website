import { useState, type FormEvent } from 'react';
import { Mail, Check, Quote, Sliders, Coffee, Clock } from 'lucide-react';
import { PRESS_QUOTES, ASSETS } from '../data/coffeeData';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'menu' | 'story' | 'locations' | 'brew') => void;
  onOpenCupping: () => void;
}

export function Footer({ setActiveTab, onOpenCupping }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#F2EDE4] border-t border-[#D4A373]/20 pt-12 pb-24 md:pb-12 text-[#5C5043]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Press Quotes */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#8C7851] font-bold block mb-1">
              San Francisco Voices
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10]">
              Decades of Neighborhood Warmth
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESS_QUOTES.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#D4A373]/25 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#D4A373] mb-3" />
                  <blockquote className="font-serif text-base sm:text-lg text-[#2C1B10] italic leading-snug">
                    “{item.quote}”
                  </blockquote>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D4A373]/20">
                  <strong className="text-xs uppercase tracking-wider text-[#6F4E37] block">
                    {item.source}
                  </strong>
                  <span className="text-[11px] text-[#5C5043] block">
                    {item.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Morning Club Newsletter Box */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-[#D4A373]/30 mb-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8C7851] mb-1">
                <Mail className="w-4 h-4 text-[#6F4E37]" />
                <span>The Vallejo St. Dispatch</span>
              </div>
              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1B10]">
                Join The Morning Club
              </h4>
              <p className="text-xs sm:text-sm text-[#5C5043] mt-1 max-w-xl leading-relaxed">
                Receive fresh drum roast notifications, single-origin arrival notices, and secret invitations to monthly cupping flights in our historic backroom.
              </p>
            </div>

            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="bg-white p-4 rounded-2xl border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Welcome aboard! Check your inbox for code <strong>FOG2013</strong> for 15% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="footer-email-input"
                    type="email"
                    required
                    placeholder="your.email@fogcity.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white border border-[#D4A373]/30 rounded-xl px-3.5 py-3 text-xs text-[#2C1B10] focus:outline-none focus:border-[#6F4E37]"
                  />
                  <button
                    id="btn-footer-subscribe"
                    type="submit"
                    className="min-h-[44px] px-5 py-3 rounded-xl bg-[#6F4E37] hover:bg-[#8C7851] text-white text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm active:scale-95"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation & Heritage Footnote */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-[#D4A373]/20">
          {/* Col 1 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img
                src={ASSETS.logo}
                alt="Fog City Roasters Logo"
                className="w-8 h-8 rounded-full object-cover border border-[#D4A373]/40"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif font-bold text-lg text-[#2C1B10]">
                Fog City Roasters
              </span>
            </div>
            <p className="text-xs text-[#5C5043] leading-relaxed">
              Hand-roasting specialty single-origin coffees under the San Francisco fog since 2013.
            </p>
            <span className="text-[11px] uppercase tracking-widest text-[#8C7851] font-bold">
              Est. 2013 • Russian Hill, SF
            </span>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-2">
            <h5 className="font-serif font-bold text-sm text-[#2C1B10]">Explore</h5>
            <button
              id="btn-footer-nav-home"
              onClick={() => setActiveTab('home')}
              className="text-left text-xs text-[#5C5043] hover:text-[#2C1B10] py-0.5 transition-colors"
            >
              Morning Roast Highlights
            </button>
            <button
              id="btn-footer-nav-menu"
              onClick={() => setActiveTab('menu')}
              className="text-left text-xs text-[#5C5043] hover:text-[#2C1B10] py-0.5 transition-colors"
            >
              Artisan Coffee &amp; Pastry Menu
            </button>
            <button
              id="btn-footer-nav-brew"
              onClick={() => setActiveTab('brew')}
              className="text-left text-xs text-[#6F4E37] font-semibold hover:text-[#2C1B10] py-0.5 transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Brew Lab &amp; Calculator</span>
            </button>
            <button
              id="btn-footer-nav-story"
              onClick={() => setActiveTab('story')}
              className="text-left text-xs text-[#5C5043] hover:text-[#2C1B10] py-0.5 transition-colors"
            >
              Our 40-Year Heritage
            </button>
            <button
              id="btn-footer-nav-locations"
              onClick={() => setActiveTab('locations')}
              className="text-left text-xs text-[#5C5043] hover:text-[#2C1B10] py-0.5 transition-colors"
            >
              Cafés &amp; Hours
            </button>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2">
            <h5 className="font-serif font-bold text-sm text-[#2C1B10]">Community &amp; Tastings</h5>
            <button
              id="btn-footer-cupping"
              onClick={onOpenCupping}
              className="text-left text-xs text-[#5C5043] hover:text-[#2C1B10] py-0.5 transition-colors"
            >
              Thursday Public Cuppings
            </button>
            <button
              onClick={() => setActiveTab('brew')}
              className="text-left text-xs text-[#5C5043] hover:text-[#2C1B10] py-0.5 transition-colors"
            >
              The Roaster's Club Subscription (15% Off)
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className="text-left text-xs text-[#5C5043] hover:text-[#2C1B10] py-0.5 transition-colors"
            >
              Whole Bean Delivery
            </button>
            <span className="text-xs text-[#8C7851] py-0.5">
              Direct Trade Partners (Oaxaca &amp; Yirgacheffe)
            </span>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-2">
            <h5 className="font-serif font-bold text-sm text-[#2C1B10]">Flagship Location</h5>
            <p className="text-xs text-[#5C5043] leading-relaxed">
              1420 Vallejo Street &amp; Hyde
              <br />
              Russian Hill, San Francisco, CA 94109
            </p>
            <span className="text-xs text-[#6F4E37] font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
              Open Daily 6:30 AM – 6:00 PM
            </span>
            <span className="text-xs text-[#5C5043]">
              (415) 555-FOG1 • hello@fogcityroasters.sf
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5C5043] gap-3">
          <p>© {new Date().getFullYear()} Fog City Roasters LLC. Hand-roasted in San Francisco.</p>
          <div className="flex items-center gap-4 text-[#8C7851]">
            <span>Powell-Hyde Cable Car Stop: Hyde &amp; Vallejo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
