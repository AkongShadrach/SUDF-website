"use client";

import { useEffect, useState } from "react";

type GalleryPhoto = {
  id: string;
  title: string;
  caption: string | null;
  image_url: string;
};

export default function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    if (!activePhoto) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto]);

  return (
    <>
      <div className="sudf-gallery-grid">
        {photos.map((photo) => (
          <figure className="sudf-gallery-item" key={photo.id}>
            <button
              type="button"
              className="sudf-gallery-image-trigger"
              onClick={() => setActivePhoto(photo)}
              aria-label={`View ${photo.title} full screen`}
            >
              <img src={photo.image_url} alt={photo.title} loading="lazy" />
            </button>
            <figcaption>{photo.caption || photo.title}</figcaption>
          </figure>
        ))}
        {photos.length === 0 ? (
          <div className="sudf-gallery-empty">
            <span className="sudf-gallery-empty-mark" aria-hidden="true">SUDF</span>
            <strong>Our outreach stories will appear here</strong>
            <p>Photos from SUDF activities will be added to this gallery as the Foundation's work continues.</p>
          </div>
        ) : null}
      </div>

      {activePhoto ? (
        <div
          className="sudf-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActivePhoto(null);
          }}
        >
          <button
            type="button"
            className="sudf-lightbox-close"
            onClick={() => setActivePhoto(null)}
            aria-label="Close photo viewer"
          >
            <span aria-hidden="true">×</span>
          </button>
          <img className="sudf-lightbox-image" src={activePhoto.image_url} alt={activePhoto.title} />
          <p className="sudf-lightbox-caption">{activePhoto.caption || activePhoto.title}</p>
        </div>
      ) : null}
    </>
  );
}
