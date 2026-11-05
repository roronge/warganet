import { useEffect, useRef } from 'react';
import { createVillageEngine } from '../engine/villageEngine';

export default function MapView({ residents, userId, messages, simulatedHour, onEngineReady }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const engine = createVillageEngine(canvasRef.current);
    engineRef.current = engine;
    onEngineReady(engine);
    return () => { engine.destroy(); engineRef.current = null; onEngineReady(null); };
  }, [onEngineReady]);

  useEffect(() => { engineRef.current?.setResidents(residents, userId); }, [residents, userId]);
  useEffect(() => { engineRef.current?.setChatBubbles(messages); }, [messages]);
  useEffect(() => {
    if (simulatedHour === null) engineRef.current?.setLive();
    else engineRef.current?.setSimulatedHour(simulatedHour);
  }, [simulatedHour]);

  return <canvas ref={canvasRef} className="village-canvas" aria-label="Peta interaktif Kampung Mini" />;
}
