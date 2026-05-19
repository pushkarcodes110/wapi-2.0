"use client";

import Logo1 from "@/public/assets/logos/logo1.png";
import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import {
  Bot,
  ChevronDown,
  GitBranch,
  Instagram,
  Library,
  Menu,
  MessageSquare,
  PhoneCall,
  Send,
  WebhookIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Images from "../../shared/Image";
import ProductDropdown from "./ProductDropdown";
import LanguageDropdown from "../layouts/LanguageDropdown";
import CurrencyDropdown from "../layouts/CurrencyDropdown";

const mobileProductItems = [
  {
    name: "Automation Builder",
    icon: <GitBranch className="w-4 h-4 shrink-0" />,
    href: "/product/automation_builder",
  },
  {
    name: "Campaigns",
    icon: <Send className="w-4 h-4 shrink-0" />,
    href: "/product/broadcast_bulk_messages",
  },
  {
    name: "AI Support Agent",
    icon: <Bot className="w-4 h-4 shrink-0" />,
    href: "/product/ai_support_agent",
  },
  {
    name: "Team Inbox",
    icon: <MessageSquare className="w-4 h-4 shrink-0" />,
    href: "/product/shared_team_inbox",
  },
  {
    name: "Instagram & Facebook",
    icon: <Instagram className="w-4 h-4 shrink-0" />,
    href: "/product/instagram_and_facebook_messenger",
  },
  {
    name: "WhatsApp Calling",
    icon: <PhoneCall className="w-4 h-4 shrink-0" />,
    href: "/product/whatsapp_business_calling",
  },
  {
    name: "Overview & Webhooks",
    icon: <WebhookIcon className="w-4 h-4 shrink-0" />,
    href: "#webhooks",
  },
  {
    name: "Library",
    icon: <Library className="w-4 h-4 shrink-0" />,
    href: "#library",
  },
];

const Header = ({ isColor = false }: { isColor?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { app_name, logo_dark_url } = useAppSelector((state) => state.setting);

  const scrollToSection = (id: string) => {
    const isLandingPage = pathname === "/" || pathname === ROUTES.Landing;
    if (!isLandingPage) {
      router.push(`${ROUTES.Landing}#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions,
    );
    const sections = ["home", "features", "support", "pricing", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: "Home", href: "home" },
    { name: "Support", href: "support" },
    { name: "Pricing", href: "pricing" },
    { name: "Contact", href: "contact" },
  ];

  const handleAuthAction = () => {
    if (isAuthenticated) {
      router.push(ROUTES.Dashboard);
    } else {
      router.push(ROUTES.Login);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div
        className={`
          px-4 sm:px-6 lg:px-10 xl:px-16
          flex items-center justify-between
          py-3 border-b border-white-opacity-15
          transition-all duration-300
          ${scrolled || isColor ? "backdrop-blur-md bg-landing-theme-dark" : ""}
        `}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Images
            src={logo_dark_url || Logo1}
            alt={`${app_name || "wapi"} logo`}
            width={100}
            height={40}
            unoptimized
            className="h-7.75 object-contain"
          />
        </Link>

        <nav className="hidden min-[1100px]:flex items-center gap-8 flex-1 justify-center">
          <a
            onClick={() => scrollToSection("home")}
            className={`relative text-[17px] font-medium transition-colors cursor-pointer whitespace-nowrap
              ${activeSection === "home" ? "text-white!" : "text-slate-300! hover:text-primary"}`}
          >
            Home
            {activeSection === "home" && (
              <span className="absolute -bottom-5.75 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="w-1 h-1 bg-primary rounded-full absolute -top-1.5" />
                <span className="w-5 h-0.5 bg-primary rounded-full mt-1.5" />
              </span>
            )}
          </a>

          <ProductDropdown scrollToSection={scrollToSection} />

          {/* Remaining links */}
          {navLinks.slice(1).map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`relative text-[17px] font-medium transition-colors cursor-pointer whitespace-nowrap
                  ${isActive ? "text-white!" : "text-slate-300! hover:text-primary"}`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="w-1 h-1 bg-primary rounded-full absolute -top-1.5" />
                    <span className="w-5 h-0.5 bg-primary rounded-full mt-1.5" />
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language & Currency always visible */}
          <LanguageDropdown onDark />
          <CurrencyDropdown onDark />

          {/* Sign In / Get Started — desktop only */}
          <div className="hidden min-[1100px]:block">
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 h-10 rounded-lg font-semibold text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              onClick={handleAuthAction}
            >
              {isAuthenticated ? "Get Started" : "Sign In"}
            </Button>
          </div>

          {/* Hamburger — mobile/tablet only */}
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="min-[1100px]:hidden text-white p-2 hover:bg-white-opacity-10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ─── Overlay ─── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 min-[1100px]:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ─── Mobile drawer ─── */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw]
          bg-landing-theme-dark z-50 shadow-2xl
          transition-transform duration-300 ease-in-out
          min-[1100px]:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-6 border-b border-white/10">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Images
                src={logo_dark_url || Logo1}
                alt={`${app_name || "wapi"} logo`}
                width={90}
                height={34}
                unoptimized
                className="h-7.75 object-contain"
              />
            </Link>
            <button
              aria-label="Close menu"
              className="text-white p-2 hover:bg-white-opacity-10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          {/* Drawer nav */}
          <nav className="flex flex-col gap-1 px-4 pt-4 pb-6">
            {/* Home */}
            <a
              onClick={() => {
                scrollToSection("home");
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] text-white/80! font-medium transition-colors cursor-pointer
                ${activeSection === "home" ? "text-primary bg-white/5" : "text-white/80! hover:text-primary hover:bg-white/5"}`}
            >
              Home
            </a>

            {/* Product accordion */}
            <div>
              <button
                onClick={() => setIsMobileProductOpen(!isMobileProductOpen)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-[15px] font-medium transition-colors
                  ${isMobileProductOpen ? "text-primary bg-white/5" : "text-white/80! hover:text-primary hover:bg-white/5"}`}
              >
                <span>Product</span>
                <ChevronDown
                  size={17}
                  className={`transition-transform duration-300 ${isMobileProductOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isMobileProductOpen && (
                <div className="mt-1 ml-2 flex flex-col gap-0.5 border-l border-white/10 pl-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  {mobileProductItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-white/60 hover:text-primary hover:bg-white/5 transition-colors group"
                    >
                      {/* Icon always visible */}
                      <span className="text-white/40 group-hover:text-primary transition-colors shrink-0">
                        {item.icon}
                      </span>
                      <span className="flex-1 leading-snug text-white">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Remaining nav links */}
            {navLinks.slice(1).map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.name}
                  onClick={() => {
                    scrollToSection(link.href);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium transition-colors cursor-pointer
                    ${isActive ? "text-primary! bg-white/5" : "text-white/80! hover:text-primary hover:bg-white/5"}`}
                >
                  {link.name}
                </a>
              );
            })}

            {/* CTA inside drawer */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button
                className="bg-primary hover:bg-primary/90 text-white w-full h-11 rounded-lg font-semibold text-[15px] transition-all hover:scale-[1.01] active:scale-[0.99]"
                onClick={() => {
                  handleAuthAction();
                  setIsMenuOpen(false);
                }}
              >
                {isAuthenticated ? "Get Started" : "Sign In"}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
