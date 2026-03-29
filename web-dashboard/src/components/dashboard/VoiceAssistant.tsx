'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function VoiceAssistant() {
  const { i18n } = useTranslation();
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcriptText, setTranscriptText] = useState<string>('');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for native speech recognition support safely
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Default language based on their i18n choice
    recognition.lang = i18n.language === 'mr' ? 'mr-IN' : (i18n.language === 'hi' ? 'hi-IN' : 'en-IN');

    recognition.onstart = () => {
      setIsListening(true);
      setTranscriptText('Listening...');
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscriptText(transcript);
      setIsListening(false);
      await processVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setTranscriptText('Could not hear you. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [i18n.language]);

  const processVoiceCommand = async (transcript: string) => {
    setIsProcessing(true);
    setTranscriptText('Processing intent...');
    
    try {
      const response = await fetch('/api/voice/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript, 
          language_code: i18n.language 
        }),
      });

      if (!response.ok) throw new Error('Query parsing failed');

      const data = await response.json();
      
      // Update UI feedback
      setTranscriptText(data.text_response || 'Done');

      // Speak the response using Speech Synthesis API
      speakResponse(data.text_response, i18n.language);

    } catch (error) {
      console.error('Voice Processing Error:', error);
      setTranscriptText('Sorry, system offline.');
    } finally {
      setIsProcessing(false);
      // Clear transcript visual after 5 seconds to reduce clutter
      setTimeout(() => setTranscriptText(''), 5000);
    }
  };

  const speakResponse = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); // kill overlapping speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'mr' ? 'mr-IN' : (langCode === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      window.speechSynthesis.cancel(); // Stop talking if currently speaking
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = i18n.language === 'mr' ? 'mr-IN' : (i18n.language === 'hi' ? 'hi-IN' : 'en-IN');
          recognitionRef.current.start();
        }
      } catch (err) {
        // Handle race conditions where start() is called mid-abort
        console.error("Recognition start race condition", err);
      }
    }
  };

  if (!isSupported) {
    // Optionally render a muted fallback or hide altogether if totally unsupported
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--space-xl)',
      right: 'var(--space-xl)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)'
    }}>
      {/* Visual Feedback Bubble */}
      {transcriptText && (
        <div className="card animate-in slide-in-from-right" style={{
          padding: 'var(--space-sm) var(--space-md)',
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          maxWidth: 240,
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)'
        }}>
          {transcriptText}
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={toggleListening}
        disabled={isProcessing}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isListening ? 'var(--color-danger)' : 'var(--color-success)',
          color: 'var(--color-bg-primary)',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          boxShadow: isListening 
            ? '0 0 0 6px rgba(220, 53, 69, 0.3)' // Danger glow pulse
            : '0 4px 12px rgba(0, 0, 0, 0.2)', // Standard floating shadow
          transition: 'all 0.3s ease',
          animation: isListening ? 'pulse 1.5s infinite ease-in-out' : 'none',
        }}
        aria-label="Voice Assistant"
      >
        {isProcessing ? (
          <Loader2 size={28} className="spin" />
        ) : isListening ? (
          <MicOff size={28} />
        ) : (
          <Mic size={28} />
        )}
      </button>

      {/* Embedded CSS specific to this component pulse */}
      <style dangerouslySetInnerHTML={{__html: "@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(220, 53, 69, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } } .spin { animation: rotation 2s infinite linear; } @keyframes rotation { from { transform: rotate(0deg); } to { transform: rotate(359deg); } }"}} />
    </div>
  );
}
