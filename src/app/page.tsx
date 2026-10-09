"use client";

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
        y > 0
        && y < DONUT_HEIGHT
        && x > 0
        && x < DONUT_WIDTH
        && distance > depth[offset]
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
    <section
      className="relative grid min-w-0 w-full max-w-[660px] justify-self-end grid-rows-[auto_minmax(360px,52vh)_auto] max-lg:grid-rows-[auto_minmax(350px,48vw)_auto] max-md:w-auto max-md:max-w-none max-md:self-stretch max-md:grid-rows-[auto_390px_auto]"
      aria-label="Rotating ASCII money loop"
    >
      <div className="flex min-h-[38px] items-center justify-between border-b border-[rgba(243,240,232,0.34)] text-[#898780] font-superior text-[8px] font-semibold uppercase tracking-[0.16em]">
        <span>Money loop / 001</span>
        <span>24 / 7</span>
      </div>

      <div className="relative grid min-w-0 place-items-center overflow-hidden" aria-hidden="true">
        <div className="pointer-events-none absolute w-[62%] aspect-square rounded-full bg-ascii-glow opacity-[0.08] blur-[110px]" />
        <pre className="relative z-[1] m-0 whitespace-pre text-[rgba(243,240,232,0.86)] font-superior text-[clamp(7px,0.86vw,13px)] font-semibold leading-[0.94] tracking-normal [text-shadow:-1px_0_rgba(56,242,239,0.52),1px_0_rgba(255,43,34,0.58)] max-md:text-[clamp(5.2px,1.6vw,6.6px)]">
          {frame}
        </pre>
        <span className="absolute z-[2] grid size-12 place-items-center text-signal font-press text-[23px] leading-none [text-shadow:-2px_0_rgba(56,242,239,0.65),2px_0_rgba(255,43,34,0.45)] animate-dollar-glitch motion-reduce:animate-none max-md:size-10 max-md:text-[18px]">
          $
        </span>
      </div>

      <div className="flex min-h-[38px] items-center justify-between border-t border-[rgba(243,240,232,0.34)] text-paper font-bartle text-[10px] uppercase tracking-[0.12em]">
        <span>Follow the incentives</span>
        <i className="h-px w-[42%] bg-caption-line" aria-hidden="true" />
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
    <main className="relative isolate grid min-h-[100svh] grid-rows-[74px_minmax(0,1fr)_42px] overflow-hidden bg-shell text-paper max-lg:grid-rows-[68px_auto_42px] max-lg:overflow-visible max-md:block">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid bg-[size:48px_48px] [mask-image:linear-gradient(90deg,transparent_0,#000_35%,#000_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_11vw_rgba(0,0,0,0.75)]" />
      <div className="pointer-events-none absolute inset-[-40%] z-[19] bg-noise bg-[size:5px_5px,7px_7px] opacity-[0.13] animate-noise motion-reduce:animate-none" aria-hidden="true" />

      <header className="relative z-[5] grid grid-cols-[1fr_auto_1fr] items-center mx-7 border-b border-[rgba(243,240,232,0.24)] max-md:h-[66px] max-md:grid-cols-[1fr_auto] max-md:mx-[18px]">
        <div className="inline-flex w-max items-center select-none">
          <span className="font-press text-lg text-[clamp(24px,2.5vw,34px)] leading-none tracking-[-0.06em]">moneymoves</span>
        </div>

        <div className="flex items-center gap-[9px] text-[#c6c4bd] font-superior text-[10px] font-bold leading-none uppercase tracking-[0.14em] max-md:hidden">
          <span className="size-[7px] rounded-full bg-signal shadow-[0_0_12px_#ff2b22] animate-status motion-reduce:animate-none" aria-hidden="true" />
          Independent financial stories
        </div>

        <a
          className="group inline-flex justify-self-end items-center gap-[7px] py-3 pl-3 font-superior text-[10px] font-bold leading-none uppercase tracking-[0.14em] transition-colors duration-150 hover:text-signal focus-visible:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-signal max-md:absolute max-md:top-[15px] max-md:right-0"
          href="https://www.youtube.com/@realisticallymoney"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch MoneyMoves on YouTube (opens in a new tab)"
        >
          YouTube
          <svg className="size-[13px] overflow-visible fill-none stroke-signal stroke-[1.25] [stroke-linecap:square] [stroke-linejoin:miter] transition-transform duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-focus-visible:translate-x-px group-focus-visible:-translate-y-px" aria-hidden="true" viewBox="0 0 16 16">
            <path d="M4 12 12 4M6 4h6v6" />
          </svg>
        </a>
      </header>

      <div id="top" className="relative z-[2] grid min-h-0 grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] items-center gap-[clamp(24px,3vw,62px)] px-7 py-[clamp(22px,3.8vh,42px)] max-lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] max-lg:py-8 max-md:flex max-md:flex-col max-md:gap-10 max-md:px-[18px] max-md:py-9 max-md:pb-12">
        <section className="min-w-0 max-w-[910px] self-center max-md:w-auto max-md:self-stretch" aria-labelledby="hero-title">
          <p className="mb-[clamp(20px,3vh,34px)] flex items-center gap-3 text-[#c6c4bd] font-superior text-[clamp(9px,0.76vw,12px)] font-bold leading-[1.25] uppercase tracking-[0.12em] max-md:mb-[29px] max-md:text-[8px]">
            <span className="inline-grid size-[25px] shrink-0 place-items-center border border-[rgba(255,43,34,0.85)] text-signal text-[9px]">01</span>
            Free financial newsletter
          </p>

          <h1 id="hero-title" className="max-w-[820px] m-0 text-paper font-peace text-[clamp(72px,9.3vw,156px)] font-normal uppercase leading-[0.72] tracking-[-0.083em] max-lg:text-[clamp(68px,9vw,102px)] max-md:text-[clamp(62px,19vw,94px)] max-md:leading-[0.74] max-[380px]:text-[64px]">
            <span className="block w-max max-w-full">Follow</span>
            <span className="relative z-0 mt-[0.12em] block w-max max-w-full text-signal [text-shadow:-2px_0_0_rgba(56,242,239,0.65),2px_0_0_rgba(188,36,255,0.4)]">
              the money.
              <span className="pointer-events-none absolute -z-[1] top-0 left-0 w-full overflow-hidden text-cyan opacity-0 translate-x-[5px] [clip-path:inset(46%_0_27%_0)] animate-title-glitch motion-reduce:animate-none" aria-hidden="true">the money.</span>
            </span>
          </h1>

          <p className="max-w-[620px] my-[clamp(26px,4.4vh,46px)] mb-[clamp(24px,3.6vh,38px)] text-[#cfcdc6] font-superior text-[clamp(16px,1.3vw,21px)] font-normal leading-[1.5] tracking-[-0.035em] max-md:my-8 max-md:mb-[27px] max-md:text-[16px] max-md:[overflow-wrap:anywhere]">
            Stories about money, power, schemes and the systems moving the world.
            Researched by people. Delivered free.
          </p>

          <form className="max-w-[680px] max-md:max-w-none" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <div className="group relative grid min-h-[62px] grid-cols-[38px_minmax(0,1fr)_auto] border border-[rgba(243,240,232,0.8)] bg-[rgba(4,4,4,0.72)] shadow-[7px_7px_0_rgba(255,43,34,0.2)] transition-[border-color,box-shadow,transform] duration-150 focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:border-paper focus-within:shadow-[7px_7px_0_#ff2b22,0_0_0_1px_#ff2b22] max-lg:grid-cols-[32px_minmax(0,1fr)] max-md:shadow-[5px_5px_0_rgba(255,43,34,0.3)]">
              <span className="self-center justify-self-end text-signal font-superior text-[27px] leading-none" aria-hidden="true">›</span>
              <input
                className="min-w-0 border-0 bg-transparent px-[14px] py-0 text-paper font-superior text-[clamp(13px,1.05vw,16px)] font-bold uppercase tracking-[0.04em] outline-none placeholder:text-[#66655f] placeholder:opacity-100 disabled:cursor-wait max-md:min-h-[58px] max-md:pr-[10px] max-md:text-[12px]"
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
              <button className="group/button inline-flex min-w-[174px] items-center justify-between gap-5 border-0 border-l border-paper bg-paper px-5 text-ink font-superior text-[11px] font-black uppercase tracking-[0.1em] transition-colors [transition-duration:140ms] hover:bg-signal hover:text-white focus-visible:bg-signal focus-visible:text-white focus-visible:outline-none disabled:cursor-wait disabled:opacity-[0.68] max-lg:col-span-2 max-lg:min-h-[50px] max-lg:border-t max-lg:border-l-0 max-md:min-h-[52px]" type="submit" disabled={isSubmitting}>
                <span>{isSubmitting ? "Connecting…" : "Join the list"}</span>
                <span className="text-[20px] text-signal transition-transform [transition-duration:140ms] group-hover/button:translate-x-1 group-hover/button:text-white group-focus-visible/button:translate-x-1 group-focus-visible/button:text-white">→</span>
              </button>
            </div>

            <div className="flex min-h-8 justify-between gap-4 pt-3 font-superior text-[9px] font-bold uppercase leading-[1.35] tracking-[0.1em] max-md:block max-md:min-h-[52px]">
              <p id="signup-note" className="m-0 text-[#77766f]">Free. No spam. Just the moves that matter.</p>
              <div
                id="signup-message"
                className={`min-h-[1.35em] text-right ${error ? "text-signal" : ""} ${success ? "text-cyan" : ""} max-md:mt-2 max-md:text-left`}
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

      <footer className="relative z-[4] grid grid-cols-[1fr_auto_1fr] items-center mx-7 border-t border-[rgba(243,240,232,0.24)] text-[#6f6e69] font-superior text-[8px] font-bold uppercase leading-none tracking-[0.14em] max-md:flex max-md:min-h-[54px] max-md:justify-between max-md:mx-[18px] max-[380px]:text-[7px]">
        <span>MoneyMoves © 2026</span>
        <span className="text-[#98968f] max-md:hidden">Research / money / power / truth</span>
        <span className="justify-self-end">Scroll less. Know more.</span>
      </footer>
    </main>
  );
}
