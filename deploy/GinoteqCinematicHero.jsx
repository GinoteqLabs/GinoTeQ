import React, { useState } from 'react';
import './GinoteqCinematicHero.css';

// Decorative stories, not product screenshots or fabricated usage metrics.
// Add VITE_GINOTEQ_HERO_VIDEO_URL after a rights-cleared, compressed Ginoteq
// showreel has been uploaded to a reliable public media URL.
export default function GinoteqCinematicHero() {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoUrl = (import.meta.env.VITE_GINOTEQ_HERO_VIDEO_URL || '').trim();
  const useVideo = Boolean(videoUrl) && !videoFailed;

  return (
    <div className={'gino-cinema' + (useVideo ? ' gino-cinema--video' : '')} aria-hidden="true">
      {useVideo ? (
        <video
          className="gino-cinema-video"
          src={videoUrl}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          disablePictureInPicture
          onError={() => setVideoFailed(true)}
        />
      ) : null}
      <div className="gino-cinema-ambient" />
      <div className="gino-cinema-gradient" />
      <div className="gino-cinema-stage">
        <div className="gino-scene gino-scene--0">
          <div className="gino-scene-kicker"><span className="gino-live-dot" /> AKHA AI · CONSTRUCTION INTELLIGENCE</div>
          <div className="gino-window gino-blueprint-window">
            <div className="gino-window-top"><i/><i/><i/><span>PROJECT SCOPE</span></div>
            <svg className="gino-blueprint" viewBox="0 0 480 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M70 201V64L241 23L414 80V201L238 234L70 201Z" stroke="#48c5eb" strokeWidth="2"/>
              <path d="M70 64L238 104L414 80M238 104V234M121 154V93L185 109V170L121 154ZM291 118L370 103V178L291 193V118Z" stroke="#75a9d9" strokeWidth="1.5"/>
              <path d="M48 64H63M48 201H63M70 220V239M414 216V239M70 246H414M36 64V201" stroke="#4c6f8a" strokeWidth="1" strokeDasharray="5 5"/>
              <circle cx="70" cy="64" r="4" fill="#2ed3ea"/><circle cx="238" cy="104" r="4" fill="#2ed3ea"/><circle cx="414" cy="80" r="4" fill="#2ed3ea"/>
            </svg>
            <div className="gino-blueprint-caption"><span className="gino-pulse-check">✓</span> AI-assisted brief <span className="gino-pill">SCOPE READY</span></div>
          </div>
        </div>
        <div className="gino-scene gino-scene--1">
          <div className="gino-scene-kicker"><span className="gino-live-dot" /> GINOTEQ · PRACTICAL SOFTWARE</div>
          <div className="gino-window gino-dashboard-window">
            <div className="gino-window-top"><i/><i/><i/><span>OPERATIONAL INTELLIGENCE</span></div>
            <div className="gino-metric-grid">
              <div><small>Data</small><strong>Connected</strong><span>One clear view</span></div>
              <div><small>Decisions</small><strong>Informed</strong><span>Real-time context</span></div>
            </div>
            <div className="gino-chart">
              <div className="gino-chart-guides"><b/><b/><b/></div>
              {[30, 43, 38, 55, 51, 69, 61, 76, 72, 89, 83, 100].map((v,i)=>(
                <i key={i} style={{ height: v + '%' }} />
              ))}
            </div>
            <div className="gino-dash-bottom"><span>DESIGNED AROUND REAL WORK</span><span>↗</span></div>
          </div>
        </div>
        <div className="gino-scene gino-scene--2">
          <div className="gino-scene-kicker"><span className="gino-live-dot" /> SPAKUL · EVERYDAY SERVICES</div>
          <div className="gino-window gino-service-window">
            <div className="gino-window-top"><i/><i/><i/><span>SERVICE JOURNEY</span></div>
            <svg className="gino-car" viewBox="0 0 460 210" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M62 148H39L28 134V112L72 101L112 56H317L362 102L423 118V146H402" stroke="#70cafa" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M132 60L99 103H347L309 60" stroke="#4a96b9" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M181 61V103M74 148H359" stroke="#4a96b9" strokeWidth="2"/>
              <circle cx="108" cy="151" r="28" fill="#0a1830" stroke="#91d8ff" strokeWidth="6"/>
              <circle cx="365" cy="151" r="28" fill="#0a1830" stroke="#91d8ff" strokeWidth="6"/>
              <path d="M230 9L221 29M265 17L256 36M305 7L296 27M340 25L331 43" stroke="#21d5e6" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="92" cy="24" r="7" stroke="#22c5f1"/><circle cx="380" cy="44" r="10" stroke="#22c5f1"/>
            </svg>
            <div className="gino-service-steps"><span>01 <b>Book</b></span><em/> <span>02 <b>Deliver</b></span><em/> <span>03 <b>Confirm</b></span></div>
          </div>
        </div>
        <div className="gino-scene gino-scene--3">
          <div className="gino-scene-kicker"><span className="gino-live-dot" /> GINOTEQ · INSIGHT · CONNECT · GROW</div>
          <div className="gino-network-wrap">
            <svg className="gino-network" viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M90 170L190 65L306 121L430 70L402 251L244 282L90 170ZM190 65L244 282M306 121L402 251M90 170L306 121" stroke="#1f9fc9" strokeWidth="2" opacity=".65"/>
              {[[90,170,14],[190,65,12],[306,121,16],[430,70,14],[402,251,13],[244,282,18]].map(([x,y,r],i)=><g key={i}><circle cx={x} cy={y} r={r+7} fill="#0d4c78" opacity=".55"/><circle cx={x} cy={y} r={r} fill="#65c8fc"/><circle cx={x-4} cy={y-4} r={r/3} fill="#e5fbff" opacity=".8"/></g>)}
            </svg>
            <div className="gino-network-label">BUILDING AFRICA <strong>INTELLIGENTLY.</strong></div>
          </div>
        </div>
      </div>
      <div className="gino-cinema-grain" />
    </div>
  );
}
