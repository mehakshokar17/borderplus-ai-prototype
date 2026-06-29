"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Send, Loader2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRecorder } from "@/hooks/useRecorder";
import { useSpeechRecognition, speechRecognitionSupported } from "@/hooks/useSpeechRecognition";
import { transcribeAudio, recordingSupported } from "@/services/speech/transcribe";
import { formatDuration } from "@/lib/utils";

interface ComposerProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onEnd?: () => void;
  canEnd?: boolean;
}

export function Composer({ onSubmit, disabled, placeholder, onEnd, canEnd }: ComposerProps) {
  const [text, setText] = React.useState("");
  const [transcribing, setTranscribing] = React.useState(false);
  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const baseRef = React.useRef(""); // text captured before the current dictation started

  // Preferred path: live, free, on-device speech-to-text via the browser.
  const liveVoice = speechRecognitionSupported();
  const sr = useSpeechRecognition({
    onInterim: (t) => setText(baseRef.current ? `${baseRef.current} ${t}` : t),
    onFinal: (t) => {
      setText(baseRef.current ? `${baseRef.current} ${t}` : t);
      taRef.current?.focus();
    },
  });

  // Fallback path: record audio and POST to /api/transcribe (used when the browser
  // lacks SpeechRecognition; with OpenRouter this returns a mock transcript).
  const rec = useRecorder();
  const canRecordFallback = !liveVoice && recordingSupported();
  const voiceAvailable = liveVoice || canRecordFallback;

  const send = () => {
    if (!text.trim() || disabled) return;
    if (sr.listening) sr.stop();
    onSubmit(text.trim());
    setText("");
    baseRef.current = "";
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const toggleVoice = async () => {
    if (liveVoice) {
      if (sr.listening) {
        sr.stop();
      } else {
        baseRef.current = text.trim();
        sr.start();
      }
      return;
    }
    // recorder fallback
    if (rec.isRecording) {
      const blob = await rec.stop();
      if (blob) {
        setTranscribing(true);
        try {
          const t = await transcribeAudio(blob);
          setText((prev) => (prev ? `${prev} ${t}` : t));
          taRef.current?.focus();
        } catch {
          /* user can still type */
        } finally {
          setTranscribing(false);
        }
      }
    } else {
      await rec.start();
    }
  };

  const listening = sr.listening || rec.isRecording;
  const voiceError = liveVoice ? sr.error : rec.error;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-medium">
            {liveVoice ? "Voice + typing" : voiceAvailable ? "Voice (beta) + typing" : "Typing"}
          </span>
          <AnimatePresence>
            {voiceError && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-rose-500">
                {voiceError}
              </motion.span>
            )}
            {listening && !voiceError && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-rose-500">
                {rec.isRecording ? `Listening… ${formatDuration(rec.seconds)}` : "Listening… speak now"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          {onEnd && (
            <button
              onClick={onEnd}
              disabled={!canEnd}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
            >
              <Flag className="h-3 w-3" /> End & review
            </button>
          )}
          <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            Enter to send
          </kbd>
        </div>
      </div>

      <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
        {voiceAvailable && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant={listening ? "destructive" : "secondary"}
                onClick={toggleVoice}
                disabled={disabled || transcribing}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                className="relative shrink-0"
              >
                {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {listening && (
                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {listening ? "Stop" : liveVoice ? "Speak — transcribes live" : "Record your answer"}
            </TooltipContent>
          </Tooltip>
        )}

        <Textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled || transcribing}
          rows={1}
          placeholder={
            transcribing
              ? "Transcribing your voice…"
              : listening
              ? "Listening…"
              : placeholder ?? "Type your reply, or tap the mic to speak…"
          }
          className="min-h-[44px] max-h-40 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />

        <Button onClick={send} disabled={disabled || transcribing || !text.trim()} size="icon" variant="gradient" aria-label="Send" className="shrink-0">
          {transcribing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
