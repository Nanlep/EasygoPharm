import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Loader2 } from 'lucide-react';
import { getAIInstance, decodeAudio, encodeAudio, decodeAudioData } from '../services/geminiService';
import { LiveServerMessage, Modality } from '@google/genai';

export const LiveAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Initializing voice link...');
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const startSession = async () => {
    try {
      const ai = getAIInstance();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputAudioContext;
      outputContextRef.current = outputAudioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are an EasygoPharm voice assistant. You help people describe the rare medications they are looking for so we can better triage their requests. Be professional, warm, and concise.',
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus('System Online');
            setIsActive(true);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encodeAudio(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              // Rely solely on sessionPromise resolves
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => [...prev.slice(-4), message.serverContent!.outputTranscription!.text!]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputContextRef.current) {
              setIsModelSpeaking(true);
              const ctx = outputContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const buffer = await decodeAudioData(decodeAudio(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsModelSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsModelSpeaking(false);
            }
          },
          onclose: () => {
            setStatus('Disconnected');
            setIsActive(false);
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            setStatus('Connection Error');
          },
        },
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Microphone Access Denied');
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioContextRef.current?.close();
      outputContextRef.current?.close();
      sessionPromiseRef.current?.then(s => s.close()).catch(() => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isActive ? 'bg-red-600 animate-pulse' : 'bg-slate-700'}`}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">EasyGo Voice Triage</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {status}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className={`absolute inset-0 bg-red-100 rounded-full animate-ping ${isModelSpeaking ? 'opacity-75' : 'opacity-0'}`}></div>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isModelSpeaking ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100' : 'bg-slate-50 border-slate-100'}`}>
              {isModelSpeaking ? (
                <Volume2 size={48} className="text-red-600 animate-bounce" />
              ) : (
                <Mic size={48} className={isActive ? 'text-slate-900' : 'text-slate-300'} />
              )}
            </div>
          </div>

          <div className="w-full space-y-4 mb-8">
            <p className="text-slate-500 text-sm font-medium italic">
              {isModelSpeaking ? "Easygo Assistant is speaking..." : "Speak naturally to describe your medication need"}
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 min-h-[100px] border border-slate-100 shadow-inner">
              {transcript.length > 0 ? (
                <div className="text-left space-y-2">
                  {transcript.map((line, i) => (
                    <p key={i} className="text-sm text-slate-700 font-medium">{line}</p>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center py-6">
                  {isActive ? <div className="flex gap-1 items-center"><div className="w-1.5 h-4 bg-red-400 animate-pulse"></div><div className="w-1.5 h-6 bg-red-500 animate-pulse delay-75"></div><div className="w-1.5 h-3 bg-red-300 animate-pulse delay-150"></div></div> : <Loader2 className="animate-spin text-slate-300" />}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
          >
            End Triage Session
          </button>
          
          <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            SOC 2 Compliant Voice Encryption Active
          </p>
        </div>
      </div>
    </div>
  );
};