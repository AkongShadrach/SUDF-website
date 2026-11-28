"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type ViewerPhoto = { url: string; alt: string; caption?: string | null };

export default function FieldStoryPhotos({ photos, title }: { photos: ViewerPhoto[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const close = () => setActive(null);
  const previous = () => setActive(current => current === null ? null : (current - 1 + photos.length) % photos.length);
  const next = () => setActive(current => current === null ? null : (current + 1) % photos.length);

  useEffect(() => {
    if (active === null) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKey); };
  }, [active, photos.length]);

  const open = (index: number) => setActive(index);
  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (dx < 0) next(); else previous();
    }
  };

  return (
    <>
      <figure className="sudf-field-cover">
        <button type="button" className="sudf-story-photo-trigger sudf-story-cover-trigger" onClick={() => open(0)} aria-label="View cover photograph full screen">
          <img src={photos[0]?.url} alt={photos[0]?.alt || title} />
        </button>
      </figure>
      {photos.length > 1 && (
        <section className="sudf-field-photo-gallery">
          <p className="eyebrow">MOMENTS FROM THE ACTIVITY</p>
          <h2>In pictures</h2>
          <div>
            {photos.slice(1).map((photo, index) => (
              <figure key={photo.url + index}>
                <button type="button" className="sudf-story-photo-trigger" onClick={() => open(index + 1)} aria-label={`View photograph ${index + 1} full screen`}>
                  <img src={photo.url} alt={photo.alt || `${title} — photograph ${index + 1}`} loading="lazy" />
                </button>
              </figure>
            ))}
          </div>
        </section>
      )}
      {active !== null && (
        <div className="sudf-lightbox" role="dialog" aria-modal="true" aria-label="Photograph viewer" onClick={event => { if (event.target === event.currentTarget) close(); }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <button type="button" className="sudf-lightbox-close" onClick={close} aria-label="Close photo viewer"><X size={26} /></button>
          {photos.length > 1 && <button type="button" className="sudf-lightbox-nav sudf-lightbox-prev" onClick={previous} aria-label="Previous photograph"><ChevronLeft size={32} /></button>}
          <img className="sudf-lightbox-image" src={photos[active].url} alt={photos[active].alt || title} />
          {photos.length > 1 && <button type="button" className="sudf-lightbox-nav sudf-lightbox-next" onClick={next} aria-label="Next photograph"><ChevronRight size={32} /></button>}
          <p className="sudf-lightbox-caption">{photos[active].caption || photos[active].alt || title} · {active + 1} of {photos.length}</p>
        </div>
      )}
    </>
  );
}
