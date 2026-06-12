import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import type { CSSProperties } from 'react';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type PillNavProps = {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string; // GSAP ease string like 'power3.easeOut'
  baseColor?: string; // nav background
  pillColor?: string; // pill bg
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
};

const isExternalLink = (href: string) =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('#');

const isRouterLink = (href: string) => href && !isExternalLink(href);

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#120F17',
  hoveredPillTextColor = '#120F17',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);

  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  const cssVars = useMemo(
    () =>
      ({
        ['--base' as any]: baseColor,
        ['--pill-bg' as any]: pillColor,
        ['--hover-text' as any]: hoveredPillTextColor,
        ['--pill-text' as any]: resolvedPillTextColor,
        ['--nav-h' as any]: '42px',
        ['--logo' as any]: '36px',
        ['--pill-pad-x' as any]: '18px',
        ['--pill-gap' as any]: '3px',
      }) as CSSProperties,
    [baseColor, pillColor, hoveredPillTextColor, resolvedPillTextColor]
  );

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circleEl, idx) => {
        if (!circleEl?.parentElement) return;

        const pillEl = circleEl.parentElement as HTMLElement;
        const rect = pillEl.getBoundingClientRect();
        const { width: w, height: h } = rect;

        if (!w || !h) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circleEl.style.width = `${D}px`;
        circleEl.style.height = `${D}px`;
        circleEl.style.bottom = `-${delta}px`;

        gsap.set(circleEl, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pillEl.querySelector('.pill-label') as HTMLElement | null;
        const white = pillEl.querySelector('.pill-label-hover') as HTMLElement | null;

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        // rebuild tween timeline for this index
        tlRefs.current[idx]?.kill();

        const tl = gsap.timeline({ paused: true });
        tl.to(circleEl, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: 'auto' },
            0
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[idx] = tl;
      });

      // Ensure menu starts hidden properly (for consistent entrance animations)
      if (mobileMenuRef.current) {
        gsap.set(mobileMenuRef.current, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
      }
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    // initial font reflow safety
    const fontsReady = (document as any).fonts?.ready;
    if (fontsReady?.then) {
      fontsReady.then(layout).catch(() => {});
    }

    if (initialLoadAnimation) {
      const logoEl = logoRef.current;
      const navItemsEl = navItemsRef.current;

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, { scale: 1, duration: 0.6, ease });
      }

      if (navItemsEl) {
        gsap.set(navItemsEl, { width: 0, overflow: 'hidden' });
        gsap.to(navItemsEl, { width: 'auto', duration: 0.6, ease });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation, mobileMenuRef]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;

    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;

    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;

    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    const lines = hamburger?.querySelectorAll('.pillnav-hamburger-line') ?? null;
    if (lines && lines.length >= 2) {
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center',
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
        });
      }
    }

    onMobileMenuClick?.();
  };

  return (
    <div className={`pillnav-wrap ${className}`.trim()} style={cssVars}>
      <nav className="pillnav-nav" aria-label="Primary">
        {items?.length ? (
          isRouterLink(items[0].href) ? (
            <Link
              to={items[0].href}
              aria-label={items[0].ariaLabel || 'Home'}
              onMouseEnter={handleLogoEnter}
              role="menuitem"
              ref={(el) => {
                logoRef.current = el;
              }}
              className="pillnav-logo"
            >
              <img src={logo} alt={logoAlt} ref={logoImgRef} className="pillnav-logo-img" />
            </Link>
          ) : (
            <a
              href={items[0].href}
              aria-label={items[0].ariaLabel || 'Home'}
              onMouseEnter={handleLogoEnter}
              ref={(el) => {
                logoRef.current = el as any;
              }}
              className="pillnav-logo"
            >
              <img src={logo} alt={logoAlt} ref={logoImgRef} className="pillnav-logo-img" />
            </a>
          )
        ) : (
          <span />
        )}

        <div
          ref={navItemsRef}
          className="pillnav-items"
          aria-hidden={false}
        >
          <ul className="pillnav-menubar" role="menubar">
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle: CSSProperties = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)',
              };

              const PillContent = (
                <>
                  <span
                    className="pillnav-hover-circle"
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="pillnav-label-stack">
                    <span className="pill-label pillnav-pill-label">{item.label}</span>
                    <span className="pill-label-hover pillnav-pill-label-hover">{item.label}</span>
                  </span>
                  {isActive && <span className="pillnav-active-dot" aria-hidden="true" />}
                </>
              );

              const basePillClasses =
                'pillnav-pill inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0';

              return (
                <li key={item.href} role="none" className="pillnav-pill-wrap">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="pillnav-hamburger"
          type="button"
        >
          <span className="pillnav-hamburger-line" />
          <span className="pillnav-hamburger-line" />
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        className="pillnav-mobile-menu"
      >
        <ul className="pillnav-mobile-list">
          {items.map((item) => {
            const defaultStyle: CSSProperties = {
              background: 'var(--pill-bg, #fff)',
              color: 'var(--pill-text, #fff)',
            };

            const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.currentTarget as any).style.background = 'var(--base)';
              (e.currentTarget as any).style.color = 'var(--hover-text, #fff)';
            };
            const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.currentTarget as any).style.background = 'var(--pill-bg, #fff)';
              (e.currentTarget as any).style.color = 'var(--pill-text, #fff)';
            };

            const linkClasses =
              'pillnav-mobile-link block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    to={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn as any}
                    onMouseLeave={hoverOut as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn as any}
                    onMouseLeave={hoverOut as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
