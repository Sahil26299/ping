"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../navbar/Navbar";
import LottieAnimationProvider from "../lottieAnimProvider/LottieAnimationProvider";
import chattingAnimationLanding from "@/public/lottieFiles/chattingAnimationLanding.json";
import { getLandingConfig } from "@/src/utilities";

const LandingPage: React.FC = () => {
  const config = getLandingConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Or render a loading skeleton
  }

  // Icon mapping for features
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactElement> = {
      lightning: (
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      lock: (
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      users: (
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    };
    return icons[iconName] || icons.lightning;
  };

  // Split heading text and insert highlighted word
  const renderHeading = () => {
    const words = config.hero.heading.text.split(" ");
    const highlightedWord = config.hero.heading.highlightedWord;
    const index = words?.indexOf(highlightedWord);

    return (
      <h1
        className={`${config.hero.heading.size} text-foreground leading-tight`}
      >
        {words.map((word, i) => (
          <React.Fragment key={i}>
            {i === index ? (
              <span className={config.hero.heading.gradient}>
                {highlightedWord}
              </span>
            ) : (
              word
            )}
            {i < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </h1>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={config.layout.container.className}>
      {/* Background Pattern */}
      <div className={config.layout.background.className} />

      {/* Navigation */}
      <Navbar variant="landing" />

      {/* Hero Section */}
      {config.hero.enabled && (
        <section
          className={`relative z-10 ${config.layout.sections.container} ${config.layout.sections.spacing}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                {renderHeading()}
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {config.hero.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {config.hero.ctaButtons.map((button) => (
                  <Link
                    key={button.id}
                    href={button.href}
                    className={button.className}
                  >
                    {button.text}
                  </Link>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-8">
                {config.hero.stats.map((stat) => (
                  <div key={stat.id} className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Animated Graphics */}
            {config.hero.animation.enabled && (
              <div className="relative flex flex-col items-end">
                <LottieAnimationProvider
                  animationFile={chattingAnimationLanding}
                  height={config.hero.animation.height}
                  width={config.hero.animation.width}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {config.features.enabled && (
        <section
          className={`relative z-10 ${config.layout.sections.container} ${config.layout.sections.spacing}`}
        >
          <header className="text-center mb-16">
            <h2
              className={`${config.features.heading.size} text-foreground mb-4`}
            >
              {config.features.heading.text}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.features.description}
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            {config.features.items.map((feature) => (
              <article
                key={feature.id}
                className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {config.cta.enabled && (
        <section
          className={`relative z-10 ${config.layout.sections.container} ${config.layout.sections.spacing}`}
        >
          <div
            className={`text-center ${config.cta.background} rounded-2xl p-12`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {config.cta.heading}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {config.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {config.cta.buttons.map((button) => (
                <Link
                  key={button.id}
                  href={button.href}
                  className={button.className}
                >
                  {button.text}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {config.footer.enabled && (
        <footer className={`relative z-10 ${config.footer.className}`}>
          <div className={config.layout.sections.container}>
            <div className="flex flex-col md:flex-row items-center justify-between py-8">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div
                  className={`${config.branding.logo.size} ${config.branding.logo.color} rounded-full flex items-center justify-center`}
                >
                  <span
                    className={`${config.branding.logo.textColor} ${config.branding.logo.textSize}`}
                  >
                    {config.branding.logo.text}
                  </span>
                </div>
                <span className={config.branding.companyNameSize}>
                  {config.branding.companyName}
                </span>
              </div>

              <div className="text-sm text-muted-foreground">
                {config.footer.copyright}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default LandingPage;
