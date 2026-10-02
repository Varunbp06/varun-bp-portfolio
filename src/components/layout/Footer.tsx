import { navItems, profile, socials } from '../../data/profile';
import { scrollBehavior, scrollToSection } from '../../lib/utils';
import Icon from '../ui/SocialIcon';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="relative border-t border-white/10 px-4 pb-28 pt-14 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          <div className="max-w-md">
            <p className="text-2xl font-semibold tracking-tight text-white">{profile.name}</p>
            <p className="mt-2 text-sm text-white/50">{profile.title}</p>
            <p className="mt-4 text-xs leading-relaxed text-white/40">
              {profile.location} · {profile.openToWork}
            </p>
          </div>

          <div className="flex flex-wrap gap-10">
            <nav aria-label="Footer sections">
              <p className="label-xs mb-3">Sections</p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className="inline-block py-1 text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="label-xs mb-3">Elsewhere</p>
              <ul className="flex flex-col gap-1.5">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith('mailto') ? undefined : '_blank'}
                      rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      className="inline-flex items-center gap-2 py-1 text-sm text-white/55 transition-colors hover:text-white"
                    >
                      <Icon name={social.icon} className="text-sm" />
                      {social.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={profile.resume}
                    download={profile.resumeFileName}
                    className="inline-flex items-center gap-2 py-1 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <Icon name="download" className="text-sm" /> Resume
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
            className="inline-flex items-center gap-2 py-2 uppercase tracking-[0.16em] transition-colors hover:text-white"
          >
            <Icon name="arrow-up" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
