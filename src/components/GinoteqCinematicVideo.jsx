import { useEffect, useState } from 'react';

// Decorative homepage film: never request it on mobile, for reduced-motion users,
// or when the browser reports Data Saver. The photographic CSS backdrop remains.
const FILM_URL = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Kdwr1NqphQ3AQUnvNY21TF1Oz7/1f8b2e43-28a9-4023-a8fe-b7021a42be66.mp4';
const MOTION_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

function shouldEnableFilm() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOTION_QUERY).matches &&
    window.navigator.connection?.saveData !== true;
}

export default function GinoteqCinematicVideo() {
  const [enabled, setEnabled] = useState(shouldEnableFilm);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOTION_QUERY);
    const connection = window.navigator.connection;
    const update = () => setEnabled(media.matches && connection?.saveData !== true);

    // Safari versions lacking addEventListener on MediaQueryList need addListener.
    if (media.addEventListener) media.addEventListener('change', update);
    else media.addListener?.(update);
    connection?.addEventListener?.('change', update);
    update();

    return () => {
      if (media.removeEventListener) media.removeEventListener('change', update);
      else media.removeListener?.(update);
      connection?.removeEventListener?.('change', update);
    };
  }, []);

  // Returning null means the video and its <source> are unmounted. CSS alone
  // can hide a video but does not reliably prevent its network request.
  if (!enabled || failed) return null;

  return (
    <video
      className="gino-video-backdrop"
      aria-hidden="true"
      tabIndex={-1}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/assets/ginoteq-video-poster.webp"
      disablePictureInPicture
      onError={() => setFailed(true)}
    >
      <source src={FILM_URL} type="video/mp4" />
    </video>
  );
}
