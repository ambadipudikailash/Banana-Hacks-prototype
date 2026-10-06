"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { footerGroups, navigationItems } from "@/data/dashboard";

type Theme = "dark" | "light";

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(siteConfig.workspaceName);
  const [profiles, setProfiles] = useState<string[]>([siteConfig.workspaceName]);
  const [newProfileName, setNewProfileName] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const accountSwitcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedProfiles = JSON.parse(localStorage.getItem("reversex-local-profiles") ?? "[]");
      const savedProfiles = Array.isArray(storedProfiles)
        ? storedProfiles.filter((profile): profile is string => typeof profile === "string" && profile.trim().length > 0)
        : [];
      const availableProfiles = Array.from(new Set([siteConfig.workspaceName, ...savedProfiles]));
      const savedWorkspace = localStorage.getItem("reversex-current-profile");
      const savedTheme = localStorage.getItem("reversex-theme");

      setProfiles(availableProfiles);
      if (savedWorkspace && availableProfiles.includes(savedWorkspace)) setWorkspaceName(savedWorkspace);
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    } catch {
      // Keep the environment-configured profile and dark theme if browser storage is unavailable.
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem("reversex-local-profiles", JSON.stringify(profiles));
      localStorage.setItem("reversex-current-profile", workspaceName);
      localStorage.setItem("reversex-theme", theme);
    } catch {
      // These preferences still work for the current page session if storage is unavailable.
    }
  }, [profiles, storageReady, theme, workspaceName]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !accountSwitcherRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountMenuOpen]);

  const handleAddProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestedName = newProfileName.trim();
    if (!requestedName) return;

    const existingProfile = profiles.find((profile) => profile.toLocaleLowerCase() === requestedName.toLocaleLowerCase());
    const nextProfile = existingProfile ?? requestedName;
    if (!existingProfile) setProfiles((currentProfiles) => [...currentProfiles, nextProfile]);
    setWorkspaceName(nextProfile);
    setNewProfileName("");
    setAccountMenuOpen(false);
  };

  return (
    <div className={`app-shell theme-${theme}`}>
      <header className="site-header page-width">
        <Link className="brand" href="/" aria-label={`${siteConfig.name} home`}>
          <span className="brand-mark"><Icon name="logo" /></span>
          <span className="brand-copy"><strong>{siteConfig.name}</strong><small>{siteConfig.tagline}</small></span>
        </Link>

        <nav className={`primary-nav${menuOpen ? " primary-nav--open" : ""}`} aria-label="Main navigation">
          {navigationItems.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              href={item.href}
              key={item.label}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
          <div className="account-switcher" ref={accountSwitcherRef}>
            <button
              className="workspace-button"
              type="button"
              aria-label={`Profile: ${workspaceName}`}
              aria-haspopup="dialog"
              aria-expanded={accountMenuOpen}
              aria-controls="account-menu"
              onClick={() => setAccountMenuOpen((isOpen) => !isOpen)}
            >
              <span className="avatar">{workspaceName.slice(0, 1).toUpperCase()}</span>
              <span>{workspaceName}</span>
              <Icon name="chevron" className="chevron-icon" />
            </button>
            {accountMenuOpen && (
              <div className="account-menu" id="account-menu" role="dialog" aria-label="Switch local profile">
                <div className="account-menu-heading">
                  <strong>Switch profile</strong>
                  <small>Profiles saved in this browser</small>
                </div>
                <div className="account-profile-list" aria-label="Available profiles">
                  {profiles.map((profile) => (
                    <button
                      className={`account-profile${workspaceName === profile ? " account-profile--active" : ""}`}
                      key={profile}
                      type="button"
                      aria-pressed={workspaceName === profile}
                      onClick={() => {
                        setWorkspaceName(profile);
                        setAccountMenuOpen(false);
                      }}
                    >
                      <span className="profile-avatar">{profile.slice(0, 1).toUpperCase()}</span>
                      <span>{profile}</span>
                      {workspaceName === profile && <Icon name="check" />}
                    </button>
                  ))}
                </div>
                <form className="account-add-form" onSubmit={handleAddProfile}>
                  <label htmlFor="new-profile-name">Add a profile</label>
                  <div>
                    <input
                      id="new-profile-name"
                      name="profileName"
                      type="text"
                      autoComplete="off"
                      maxLength={40}
                      placeholder="Enter a display name"
                      value={newProfileName}
                      onChange={(event) => setNewProfileName(event.currentTarget.value)}
                    />
                    <button type="submit" disabled={!newProfileName.trim()}>Add</button>
                  </div>
                </form>
                <p className="account-menu-note">Local display profiles only. Sign-in and account data are not connected.</p>
              </div>
            )}
          </div>
          <button
            className="icon-button menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      {children}

      <footer className="site-footer" id="footer">
        <div className="page-width footer-main">
          <div className="footer-brand">
            <Link className="brand" href="/">
              <span className="brand-mark brand-mark--footer"><Icon name="logo" /></span>
              <span className="brand-copy"><strong>{siteConfig.name}</strong><small>{siteConfig.tagline}</small></span>
            </Link>
            <p>From real-world objects to engineering insight — powered by AI.</p>
            <span className="footer-build"><span /> Built for curious minds</span>
          </div>
          {footerGroups.map((group) => (
            <div className="footer-group" key={group.id}>
              <h3>{group.title}</h3>
              {group.links.map((link) => <Link href={link.href} key={`${group.id}-${link.label}`}>{link.label}</Link>)}
            </div>
          ))}
          <div className="footer-group footer-connect">
            <h3>Connect</h3>
            <div className="social-icons" aria-label="Social channels">
              <span role="img" aria-label="LinkedIn"><Icon name="linkedin" /></span>
              <span role="img" aria-label="GitHub"><Icon name="github" /></span>
              <span role="img" aria-label="X"><Icon name="x" /></span>
            </div>
            <p>Follow the project as it grows.</p>
          </div>
        </div>
        <div className="page-width footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.name}. Built for learners, researchers and builders.</span>
          <Link href="/">Back to top <Icon name="arrow" /></Link>
        </div>
      </footer>
    </div>
  );
}
