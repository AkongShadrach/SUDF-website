"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryPhoto = { id: string; title: string; caption: string | null; image_url: string };

export default function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const close = () => setActiveIndex(null);
  const previous = () => setActiveIndex(current => current === null ? null : (current - 1 + photos.length) % photos.length);
  const next = () => setActiveIndex(current => current === null ? null : (current + 1) % photos.length);

  useEffect(() => {
    if (activeIndex === null) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener("keydown", onKey); };
  }, [activeIndex, photos.length]);

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

  const activePhoto = activeIndex === null ? null : photos[activeIndex];
  return (
    <>
      <div className="sudf-gallery-grid">
        {photos.map((photo, index) => (
          <figure className="sudf-gallery-item" key={photo.id}>
            <button type="button" className="sudf-gallery-image-trigger" onClick={() => setActiveIndex(index)} aria-label={`View ${photo.title} full screen`}>
              <img src={photo.image_url} alt={photo.title} loading="lazy" />
            </button>
            <figcaption>{photo.caption || photo.title}</figcaption>
          </figure>
        ))}
        {photos.length === 0 && <div className="sudf-gallery-empty"><span className="sudf-gallery-empty-mark" aria-hidden="true">SUDF</span><strong>Our outreach stories will appear here</strong><p>Photos from SUDF activities will be added to this gallery as the Foundation's work continues.</p></div>}
      </div>
      {activePhoto && activeIndex !== null && (
        <div className="sudf-lightbox" role="dialog" aria-modal="true" aria-label={activePhoto.title} onClick={event => { if (event.target === event.currentTarget) close(); }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <button type="button" className="sudf-lightbox-close" onClick={close} aria-label="Close photo viewer"><X size={26} /></button>
          {photos.length > 1 && <button type="button" className="sudf-lightbox-nav sudf-lightbox-prev" onClick={previous} aria-label="Previous photograph"><ChevronLeft size={32} /></button>}
          <img className="sudf-lightbox-image" src={activePhoto.image_url} alt={activePhoto.title} />
          {photos.length > 1 && <button type="button" className="sudf-lightbox-nav sudf-lightbox-next" onClick={next} aria-label="Next photograph"><ChevronRight size={32} /></button>}
          <p className="sudf-lightbox-caption">{activePhoto.caption || activePhoto.title} · {activeIndex + 1} of {photos.length}</p>
        </div>
      )}
    </>
  );
}
