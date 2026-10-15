'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createGameAudio, type GameAudio } from './audio';
import { defaultPreviewSettings, type PreviewSettings } from './preview-settings';
import { PauseSettings } from './pause-settings';
import { Icon } from '../components/icon';
import { createGameBridge, type GameBridge } from './bridge';
import { attachGameHost } from './host-lifecycle';
export function GameHost() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewSettings, setPreviewSettings] = useState(defaultPreviewSettings);
  const settingsRef = useRef(previewSettings);
  const audioRef = useRef<GameAudio | null>(null);
  const [effectsPreview, setEffectsPreview] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundPending, setSoundPending] = useState(false);
  const [soundMessage, setSoundMessage] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const session = useRef<HTMLElement>(null);
  const bridgeRef = useRef<GameBridge | null>(null);
  const [status, setStatus] = useState('Preparing the canvas…');
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [lives, setLives] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const parent = container.current;
    if (!parent) return;
    const audio = createGameAudio(); audioRef.current = audio;
    const bridge = createGameBridge();
    bridgeRef.current = bridge;
    const unsubscribe = bridge.onEvent(event => {
      if (event.type === 'effect') audio.play(event.cue);
      if (event.type === 'ready') { bridge.send({ type: 'configure-preview', settings: settingsRef.current }); setReady(true); setStatus('Canvas ready. Verified rounds are not available yet.'); }
      if (event.type === 'score-changed') setScore(event.score);
      if (event.type === 'lives-changed') setLives(event.lives);
      if (event.type === 'error') { setStatus(event.message); setFailed(true); setReady(false); setPaused(false); }
    });
    const host = attachGameHost(parent, bridge, () => import('./runtime'), () => {
      setFailed(true); setReady(false); setPaused(false); setStatus('The canvas could not load. Retry to reconnect the renderer.');
    });
    return () => { audioRef.current = null; audio.dispose(); bridgeRef.current = null; unsubscribe(); host.dispose(); bridge.dispose(); };
  }, [attempt]);
  useEffect(() => {
    setFullscreenSupported(Boolean(document.fullscreenEnabled));
    const changed = () => setFullscreen(document.fullscreenElement === session.current);
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  useEffect(() => {
    const surface = board.current;
    if (!surface) return;
    // Native non-passive handling covers the canvas, overlays and board edges.
    // Do not stop propagation: Phaser must still receive the swipe.
    const preventPagePan = (event: TouchEvent) => { if (event.cancelable) event.preventDefault(); };
    surface.addEventListener('touchmove', preventPagePan, { passive: false });
    return () => surface.removeEventListener('touchmove', preventPagePan);
  }, []);
  function togglePause() {
    if (!ready || failed) return;
    bridgeRef.current?.send({ type: paused ? 'resume' : 'pause' });
    audioRef.current?.stop();
    setSettingsOpen(false);
    setPaused(value => !value);
  }
  async function toggleFullscreen() {
    setDisplayError(null);
    try {
      if (document.fullscreenElement === session.current) await document.exitFullscreen();
      else await session.current?.requestFullscreen();
    } catch { setDisplayError('Full screen is unavailable here. You can continue in this view.'); }
  }
  function retry() {
    setSettingsOpen(false);
    setEffectsPreview(false); setSoundEnabled(false); setSoundPending(false);
    setFailed(false); setReady(false); setPaused(false); setScore(null); setLives(null);
    setStatus('Preparing the canvas…'); setAttempt(value => value + 1);
  }
  async function toggleSound() {
    const audio = audioRef.current; if (!audio) return;
    if (soundEnabled) { audio.mute(); setSoundEnabled(false); return; }
    setSoundPending(true); audio.setVolume(.35);
    const enabled = await audio.enable();
    if (audioRef.current !== audio) return;
    setSoundEnabled(enabled); setSoundPending(false);
    setSoundMessage(enabled ? null : 'Audio could not start in this browser. You can still use the visual preview.');
    if (enabled) audio.play('click');
  }
  function changeSettings(settings: PreviewSettings) {
    settingsRef.current = settings; setPreviewSettings(settings);
    bridgeRef.current?.send({ type: 'configure-preview', settings });
  }
  function togglePreview() {
    if (!ready || failed) return;
    audioRef.current?.stop();
    bridgeRef.current?.send({ type: 'resume' }); setPaused(false);
    bridgeRef.current?.send({ type: 'preview', enabled: !effectsPreview });
    setSettingsOpen(false);
    setEffectsPreview(value => !value);
  }
  return <section onClickCapture={event => { if (event.target instanceof Element && event.target.closest('button:not([data-sound-preview])')) audioRef.current?.play('click'); }} ref={session} className="game-session" aria-label="Slyce game session">
    <div className="session-hud" aria-label="Round readings"><div className="hud-brand"><Link href="/play" aria-label="Slyce lobby"><Icon name="back" /><span>SLYCE</span></Link><div className="hud-title"><strong>The cutting floor</strong><span>Free slicing</span></div></div>
      <div className="hud-reading score-reading"><Icon name="chart" /><span>SCORE<strong>{score === null ? 'Not started' : score.toLocaleString()}</strong></span></div>
      <div className="hud-reading"><Icon name="heart" /><span>LIVES<strong>{lives === null ? 'Not set' : lives}</strong></span></div>
      <div className="hud-reading combo-reading"><span>COMBO<strong>Not active</strong></span><span className="combo-track" aria-hidden="true" /></div>
      <div className="hud-reading"><Icon name="timer" /><span>ROUND<strong>Not started</strong></span></div>
    </div>
    <div ref={board} className={effectsPreview ? 'chopping-board effects-active' : 'chopping-board'} aria-label="Game canvas">
      <div ref={container} className="game-canvas" aria-hidden="true" />

      {(!effectsPreview || paused || failed) && <div className={paused || failed ? 'board-center' : 'board-center board-ready'}>{!paused && !failed && <Image className="ready-fruit-art" src="/game/fruit-splash-v1.webp" alt="" width={1672} height={941} priority unoptimized />}<span className="board-symbol"><Icon name={paused ? 'pause' : 'scissors'} /></span><p className="eyebrow">{paused ? 'TAKE A BREATHER' : 'SLICE INTO SOMETHING GOOD'}</p><h2>{failed ? 'Canvas unavailable' : paused ? 'Your board is paused.' : 'Ready to slice?'}</h2><p className={!paused && !failed ? 'sr-only' : undefined} role={failed ? 'alert' : 'status'}>{paused ? 'Resume the canvas whenever you are ready.' : status}</p>
      {failed ? <button className="button" onClick={retry}><Icon name="reset" /> Retry canvas</button> : paused ? <button className="button" onClick={togglePause}><Icon name="play" /> Resume canvas</button> : <button className="button board-start" aria-label="Start effects preview" title="Cosmetic cutting preview. No score or rewards are recorded." disabled={!ready} onClick={togglePreview}><Icon name="play" /> Start slicing</button>}
      {paused && !failed && <button className="control-button pause-settings-trigger" onClick={() => setSettingsOpen(true)}><Icon name="settings" /> Settings</button>}
      {!paused && !failed && <><p className="ready-instruction">Swipe through the fruit. Make every cut count.</p><span className="ready-mode">{previewSettings.difficulty} · {previewSettings.fruits.length} fruit types</span><p id="round-boundary" className="board-boundary">Free slicing · No score recorded</p></>}</div>}
      {effectsPreview && !paused && !failed && <div className="preview-caption">EFFECTS PREVIEW · Swipe across the fruit · No score recorded</div>}
      <span className="board-corner corner-top" aria-hidden="true" /><span className="board-corner corner-bottom" aria-hidden="true" />
    </div>
    <div className="arena-quick-controls" role="group" aria-label="Quick arena controls">
      <button className="control-button" disabled={!ready || failed} aria-label={paused ? 'Resume canvas' : 'Pause canvas'} aria-pressed={paused} onClick={togglePause}><Icon name={paused ? 'play' : 'pause'} /><span>{paused ? 'Resume' : 'Pause'}</span></button>
      <button className="control-button" disabled={soundPending || !ready} aria-label={soundPending ? 'Starting audio…' : soundEnabled ? 'Mute sound' : 'Enable sound'} aria-pressed={soundEnabled} onClick={toggleSound}><Icon name={soundEnabled ? 'sound' : 'muted'} /><span>{soundPending ? 'Starting…' : soundEnabled ? 'Sound on' : 'Sound off'}</span></button>
      <button className="control-button" disabled={!fullscreenSupported} aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} title={fullscreenSupported ? undefined : 'Full screen is not supported in this browser'} onClick={toggleFullscreen}><Icon name={fullscreen ? 'shrink' : 'expand'} /><span>{fullscreen ? 'Restore' : 'Expand'}</span></button>
      <button className="control-button" disabled={!ready || failed} aria-label={effectsPreview ? 'Exit effects preview' : 'Try cutting effects'} aria-pressed={effectsPreview} onClick={togglePreview}><Icon name={effectsPreview ? 'back' : 'play'} /><span>{effectsPreview ? 'Finish' : 'Slice'}</span></button>
    </div>
    {settingsOpen && paused && !failed && <PauseSettings settings={previewSettings} soundEnabled={soundEnabled} soundPending={soundPending} message={soundMessage} onClose={() => setSettingsOpen(false)} onSound={() => { void toggleSound(); }} onChange={changeSettings} />}
    {soundMessage && <p className="arena-notice" role="status">{soundMessage}</p>}
    {displayError && <p className="error-text" role="status">{displayError}</p>}

  </section>;
}
