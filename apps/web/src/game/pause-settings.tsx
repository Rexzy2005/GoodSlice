'use client';
import { useEffect, useRef } from 'react';
import { Icon } from '../components/icon';
import { fruitKinds } from './fruit-texture';
import { difficulties, toggleFruit, type PreviewSettings } from './preview-settings';
interface Props {
  settings: PreviewSettings; soundEnabled: boolean; soundPending: boolean; message: string | null;
  onClose: () => void; onSound: () => void; onChange: (settings: PreviewSettings) => void;
}
export function PauseSettings(props: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current; if (!element) return; element.showModal(); return () => element.close(); }, []);
  return <dialog ref={dialog} className="pause-settings" aria-labelledby="pause-settings-title" onCancel={event => { event.preventDefault(); props.onClose(); }}>
    <header><h2 id="pause-settings-title"><Icon name="settings" /> Settings</h2><button type="button" className="control-button" onClick={props.onClose} autoFocus>Done</button></header>
    <fieldset className="setting-group"><legend>Difficulty</legend><div className="difficulty-options">{difficulties.map(difficulty => <label key={difficulty}><input type="radio" name="difficulty" value={difficulty} checked={props.settings.difficulty === difficulty} onChange={() => props.onChange({ ...props.settings, difficulty })} /><span>{difficulty}</span></label>)}</div></fieldset>
    <div className="settings-row settings-sound"><span>Sound</span><button type="button" className="control-button" role="switch" aria-label="Game sound" aria-checked={props.soundEnabled} disabled={props.soundPending} onClick={props.onSound}><Icon name={props.soundEnabled ? 'sound' : 'muted'} />{props.soundPending ? 'Starting…' : props.soundEnabled ? 'On' : 'Off'}</button></div>
    <fieldset className="setting-group"><legend>Fruit selection</legend><p>Keep at least one fruit selected.</p><div className="fruit-options">{fruitKinds.map(fruit => <label key={fruit}><input type="checkbox" checked={props.settings.fruits.includes(fruit)} disabled={props.settings.fruits.length === 1 && props.settings.fruits.includes(fruit)} onChange={() => props.onChange(toggleFruit(props.settings, fruit))} /><span>{fruit === 'melon' ? 'Watermelon' : fruit}</span></label>)}</div></fieldset>
    {props.message && <p role="status">{props.message}</p>}
  </dialog>;
}
