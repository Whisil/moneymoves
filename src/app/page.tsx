"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const DONUT_WIDTH = 68;
const DONUT_HEIGHT = 32;
const DONUT_SHADES = ".,-~:;=!*#$@";

function drawDonut(rotationX: number, rotationZ: number) {
  const output = Array<string>(DONUT_WIDTH * DONUT_HEIGHT).fill(" ");
  const depth = Array<number>(DONUT_WIDTH * DONUT_HEIGHT).fill(0);

  for (let ring = 0; ring < Math.PI * 2; ring += 0.07) {
    for (let circle = 0; circle < Math.PI * 2; circle += 0.02) {
      const sinCircle = Math.sin(circle);
      const cosRing = Math.cos(ring);
      const sinX = Math.sin(rotationX);
      const sinRing = Math.sin(ring);
      const cosX = Math.cos(rotationX);
      const ringDepth = cosRing + 2;
      const distance = 1 / (sinCircle * ringDepth * sinX + sinRing * cosX + 5);
      const cosCircle = Math.cos(circle);
      const cosZ = Math.cos(rotationZ);
      const sinZ = Math.sin(rotationZ);
      const vertical = sinCircle * ringDepth * cosX - sinRing * sinX;
      const x = Math.floor(DONUT_WIDTH / 2 + 29 * distance * (cosCircle * ringDepth * cosZ - vertical * sinZ));
      const y = Math.floor(DONUT_HEIGHT / 2 + 14 * distance * (cosCircle * ringDepth * sinZ + vertical * cosZ));
      const offset = x + DONUT_WIDTH * y;
      const luminance = Math.floor(
        8 * ((sinRing * sinX - sinCircle * cosRing * cosX) * cosZ
          - sinCircle * cosRing * sinX
          - sinRing * cosX
          - cosCircle * cosRing * sinZ),
      );

      if (
        y > 0 &&
        y < DONUT_HEIGHT &&
        x > 0 &&
        x < DONUT_WIDTH &&
        distance > depth[offset]
      ) {
        depth[offset] = distance;
        output[offset] = DONUT_SHADES[Math.max(0, Math.min(DONUT_SHADES.length - 1, luminance))];
      }
    }
  }

  let frame = "";
  for (let row = 0; row < DONUT_HEIGHT; row += 1) {
    frame += output.slice(row * DONUT_WIDTH, (row + 1) * DONUT_WIDTH).join("") + "\n";
  }
  return frame;
}

function AsciiDonut() {
  const [frame, setFrame] = useState(() => drawDonut(0.8, 0.25));

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let animationFrame = 0;
    let previousTime = 0;
    let rotationX = 0.8;
    let rotationZ = 0.25;

    const animate = (time: number) => {
      if (time - previousTime > 55) {
        rotationX += 0.045;
        rotationZ += 0.018;
        setFrame(drawDonut(rotationX, rotationZ));
        previousTime = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="ascii-visual" aria-label="Rotating ASCII money loop">
      <div className="ascii-visual__meta">
        <span>Money loop / 001</span>
        <span>24 / 7</span>
      </div>

      <div className="ascii-visual__stage" aria-hidden="true">
        <pre className="ascii-visual__donut">{frame}</pre>
        <span className="ascii-visual__dollar">$</span>
      </div>

      <div className="ascii-visual__caption">
        <span>Follow the incentives</span>
        <i aria-hidden="true" />
      </div>
    </section>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail) {
      setError("Enter your email to join the list.");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setError("That email does not look right. Check it and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("emails")
        .insert({ email: normalizedEmail });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("You are already on the list.");
        } else {
          setError("Signal lost. Please try again in a moment.");
        }
        console.error("Supabase error:", insertError);
      } else {
        setSuccess(true);
        setEmail("");
      }
    } catch (submissionError) {
      setError("Signal lost. Please try again in a moment.");
      console.error("Subscription error:", submissionError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="site-shell">
      <div className="site-noise" aria-hidden="true" />

      <header className="site-header">
        <div className="brand" aria-label="MoneyMoves">
          <Image
            src="/images/moneymoves-logo.png"
            alt="MoneyMoves"
            width={433}
            height={57}
            className="brand__image"
            priority
          />
        </div>

        <div className="site-header__label">
          <span className="site-header__dot" aria-hidden="true" />
          Independent financial stories
        </div>

        <a
          className="youtube-link"
          href="https://www.youtube.com/@realisticallymoney"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch MoneyMoves on YouTube (opens in a new tab)"
        >
          YouTube
          <svg aria-hidden="true" viewBox="0 0 16 16">
            <path d="M4 12 12 4M6 4h6v6" />
          </svg>
        </a>
      </header>

      <div id="top" className="hero">
        <section className="hero__content" aria-labelledby="hero-title">
          <p className="eyebrow">
            <span>01</span> Free financial newsletter
          </p>

          <h1 id="hero-title" className="hero__title">
            <span>Follow</span>
            <span className="hero__title-accent" data-text="the money.">the money.</span>
          </h1>

          <p className="hero__description">
            Stories about money, power, schemes and the systems moving the world.
            Researched by people. Delivered free.
          </p>

          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <div className="signup-form__row">
              <span className="signup-form__prompt" aria-hidden="true">›</span>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="YOU@EMAIL.COM"
                disabled={isSubmitting}
                aria-invalid={Boolean(error)}
                aria-describedby="signup-message signup-note"
              />
              <button type="submit" disabled={isSubmitting}>
                <span>{isSubmitting ? "Connecting…" : "Join the list"}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="signup-form__meta">
              <p id="signup-note">Free. No spam. Just the moves that matter.</p>
              <div
                id="signup-message"
                className={`signup-form__message ${error ? "is-error" : ""} ${success ? "is-success" : ""}`}
                aria-live="polite"
                role="status"
              >
                {error || (success ? "You’re in. Watch your inbox." : "")}
              </div>
            </div>
          </form>
        </section>

        <AsciiDonut />
      </div>

      <footer className="site-footer">
        <span>MoneyMoves © 2026</span>
        <span className="site-footer__center">Research / money / power / truth</span>
        <span>Scroll less. Know more.</span>
      </footer>
    </main>
  );
}
