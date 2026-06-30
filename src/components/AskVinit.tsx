'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Copy, Check, Trash2 } from 'lucide-react'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const MAX_USER_MESSAGES = 10
const MAX_USER_MESSAGE_CHARS = 300
const STORAGE_KEY = 'ask-vinit-chat'
const STORAGE_COUNT_KEY = 'ask-vinit-count'

const WELCOME: Message = {
  role: 'assistant',
  content: "Hey! 👋 I'm Vinit's AI assistant. Ask me anything about his skills, projects, experience, or availability.",
}

const SUGGESTIONS = [
  'Is Vinit available for hire?',
  'What tech stack does he use?',
  'Tell me about his projects',
  'What is his education?',
]

// ─────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '12px 14px' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#0ea5e9' }}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function AskVinit() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [hasUnread, setHasUnread] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [userMsgCount, setUserMsgCount] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  const updateConstraints = () => {
    setDragConstraints({
      left: -(window.innerWidth - 100),
      right: 0,
      top: -(window.innerHeight - 100),
      bottom: 0,
    })
  }
  updateConstraints()
  window.addEventListener('resize', updateConstraints)
  return () => window.removeEventListener('resize', updateConstraints)
}, [])

useEffect(() => {
  setMounted(true)

  // Inject styles client-side only to avoid SSR hydration mismatch
  const styleId = 'ask-vinit-styles'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      .av-input:focus { outline: none; }
      .av-input::placeholder { color: #475569; }
      .av-scroll::-webkit-scrollbar { width: 4px; }
      .av-scroll::-webkit-scrollbar-track { background: transparent; }
      .av-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
      .av-suggestion:hover {
        background: rgba(14,165,233,0.15) !important;
        color: #0ea5e9 !important;
        border-color: rgba(14,165,233,0.35) !important;
      }
      .av-copy-btn { transition: opacity 0.15s; }
      .av-shortcut-hint {
        position: absolute;
        bottom: 90px;
        right: 0;
        background: rgba(15,23,42,0.95);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        padding: 5px 10px;
        color: #64748b;
        font-size: 11px;
        white-space: nowrap;
        pointer-events: none;
        font-family: system-ui;
      }
      @media (max-width: 480px) {
        .av-panel {
          width: calc(100vw - 24px) !important;
          right: -8px !important;
          height: 70vh !important;
        }
      }
    `
    document.head.appendChild(style)
  }
}, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const savedCount = localStorage.getItem(STORAGE_COUNT_KEY)
      if (saved) {
        const parsed: Message[] = JSON.parse(saved)
        if (parsed.length > 0) {
          setMessages(parsed)
          setShowSuggestions(false)
        }
      }
      if (savedCount) setUserMsgCount(parseInt(savedCount, 10))
    } catch {}
  }, [])

  // ── Persist chat to localStorage ──
  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch {}
    }
  }, [messages])

  // ── Auto scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Focus input when opened ──
  useEffect(() => {
    if (open) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  // ── Keyboard shortcuts ──
  // Press "/" to open · Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── Copy message ──
  const copyMessage = (content: string, index: number) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // ── Clear chat ──
  const clearChat = () => {
    setMessages([WELCOME])
    setShowSuggestions(true)
    setUserMsgCount(0)
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_COUNT_KEY)
    } catch {}
  }

  // ── Send message ──
  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading || streaming) return
    if (msg.length > MAX_USER_MESSAGE_CHARS) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Please keep your message under ${MAX_USER_MESSAGE_CHARS} characters.`,
        },
      ])
      return
    }

    // ✅ Rate limit check
    if (userMsgCount >= MAX_USER_MESSAGES) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ You've reached the ${MAX_USER_MESSAGES} message limit for this session. Clear the chat to continue!`,
        },
      ])
      return
    }

    setInput('')
    setShowSuggestions(false)

    const newCount = userMsgCount + 1
    setUserMsgCount(newCount)
    try { localStorage.setItem(STORAGE_COUNT_KEY, String(newCount)) } catch {}

    const newMessages: Message[] = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      
let sessionId =
  localStorage.getItem(
    'ask-vinit-session'
  )

if (!sessionId) {
  sessionId =
    Math.random()
      .toString(36)
      .slice(2)

  localStorage.setItem(
    'ask-vinit-session',
    sessionId
  )
}
const res = await fetch('/api/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    messages: newMessages.slice(1),
    session_id: sessionId,
  }),
})

      if (!res.ok) throw new Error('API error')

      // ✅ Stream the response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      setLoading(false)
      setStreaming(true)

      // Add empty assistant message to start filling
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      let fullText = ''
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: fullText },
        ])
      }

      setStreaming(false)
    } catch {
      setLoading(false)
      setStreaming(false)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again!' },
      ])
    }
  }, [input, loading, streaming, messages, userMsgCount])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isLimited = userMsgCount >= MAX_USER_MESSAGES
  const remaining = MAX_USER_MESSAGES - userMsgCount
  const charsRemaining = MAX_USER_MESSAGE_CHARS - input.length
if (!mounted) return null
  return (
    <>

      <motion.div
  drag
  dragMomentum={false}
  dragElastic={0.05}
  dragConstraints={dragConstraints}
  whileDrag={{ scale: 1.05 }}
  style={{
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    cursor: 'grab',
    touchAction: 'none',
  }}
>

        {/* ── Chat panel ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="av-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                bottom: 68, right: 0,
                width: 340, height: 500,
                background: '#020817',
                border: '1px solid rgba(14,165,233,0.18)',
                borderRadius: 20,
                boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(14,165,233,0.1), 0 32px 80px rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >

              {/* ── Header ── */}
              <div style={{
                padding: '13px 16px',
                background: '#0f172a',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', gap: 11,
                flexShrink: 0,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 16, color: '#fff',
                  boxShadow: '0 0 16px rgba(14,165,233,0.3)',
                  flexShrink: 0,
                }}>V</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>
                    Ask Vinit AI
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: isLimited ? '#f59e0b' : '#10b981',
                      boxShadow: `0 0 6px ${isLimited ? '#f59e0b' : '#10b981'}`,
                    }} />
                    <span style={{
                      color: isLimited ? '#f59e0b' : '#10b981',
                      fontSize: 11, fontWeight: 600,
                    }}>
                      {isLimited
                        ? 'Limit reached — clear to continue'
                        : `Online · ${remaining} messages left`}
                    </span>
                  </div>
                </div>

                {/* Clear button */}
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 8, width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#475569', flexShrink: 0,
                  }}
                >
                  <Trash2 size={12} />
                </button>

                {/* Close button */}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 8, width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#475569', flexShrink: 0,
                  }}
                >
                  <X size={13} />
                </button>
              </div>

              {/* ── Messages ── */}
              <div
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
                className="av-scroll"
                style={{
                  flex: 1, overflowY: 'auto',
                  padding: '14px 12px',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div style={{ position: 'relative', maxWidth: '84%' }}>
                      <div style={{
                        padding: '10px 13px',
                        borderRadius: m.role === 'user'
                          ? '16px 16px 4px 16px'
                          : '16px 16px 16px 4px',
                        background: m.role === 'user'
                          ? 'linear-gradient(135deg, #0ea5e9, #7c3aed)'
                          : '#1e293b',
                        border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                        color: '#f1f5f9',
                        fontSize: 13,
                        lineHeight: 1.65,
                        wordBreak: 'break-word',
                      }}>
                        {m.content}
                        {/* ✅ Streaming cursor */}
                        {streaming && i === messages.length - 1 && m.role === 'assistant' && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            style={{ display: 'inline-block', width: 2, height: 13, background: '#0ea5e9', marginLeft: 2, verticalAlign: 'middle', borderRadius: 1 }}
                          />
                        )}
                      </div>

                      {/* ✅ Copy button — appears on hover */}
                      {hoveredIndex === i && !streaming && m.content && (
                        <motion.button
                          className="av-copy-btn"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => copyMessage(m.content, i)}
                          title="Copy message"
                          style={{
                            position: 'absolute',
                            top: -10,
                            right: m.role === 'user' ? 0 : 'auto',
                            left: m.role === 'assistant' ? 0 : 'auto',
                            background: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 7,
                            width: 26, height: 26,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: copiedIndex === i ? '#10b981' : '#64748b',
                          }}
                        >
                          {copiedIndex === i ? <Check size={11} /> : <Copy size={11} />}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator (before streaming starts) */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                      <div style={{
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '16px 16px 16px 4px',
                      }}>
                        <TypingIndicator />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Suggestion chips */}
                {showSuggestions && messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}
                  >
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        className="av-suggestion"
                        onClick={() => sendMessage(s)}
                        style={{
                          background: 'rgba(14,165,233,0.07)',
                          border: '1px solid rgba(14,165,233,0.18)',
                          color: '#94a3b8', fontSize: 11, fontWeight: 600,
                          padding: '5px 11px', borderRadius: 999,
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >{s}</button>
                    ))}
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* ── Input ── */}
              <div style={{
                padding: '10px 12px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: '#0f172a',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  ref={inputRef}
                  className="av-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_USER_MESSAGE_CHARS))}
                  onKeyDown={handleKey}
                  maxLength={MAX_USER_MESSAGE_CHARS}
                  placeholder={isLimited ? 'Message limit reached…' : 'Ask anything about Vinit…'}
                  disabled={loading || streaming || isLimited}
                  style={{
                    flex: 1,
                    background: '#020817',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                    padding: '9px 12px',
                    color: '#f1f5f9',
                    fontSize: 13,
                    opacity: isLimited ? 0.5 : 1,
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage()}
                  disabled={loading || streaming || !input.trim() || isLimited}
                  style={{
                    width: 36, height: 36,
                    borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                    cursor: (input.trim() && !loading && !streaming && !isLimited) ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: (input.trim() && !loading && !streaming && !isLimited) ? 1 : 0.35,
                    transition: 'opacity 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <Send size={14} color="#fff" />
                </motion.button>
                </div>
                {!isLimited && (
                  <div
                    style={{
                      marginTop: 6,
                      textAlign: 'right',
                      color: charsRemaining <= 30 ? '#f59e0b' : '#64748b',
                      fontSize: 10,
                      lineHeight: 1,
                    }}
                  >
                    {charsRemaining} characters left
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Keyboard hint (shown briefly on load) ── */}
        {!open && (
          <motion.div
            className="av-shortcut-hint"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 3, duration: 0.4 }}
            style={{
              position: 'absolute',
              bottom: 68, right: 0,
              background: 'rgba(15,23,42,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '5px 10px',
              color: '#64748b',
              fontSize: 11,
              whiteSpace: 'nowrap',
              fontFamily: 'system-ui',
              pointerEvents: 'none',
            }}
          >
            Press <kbd style={{ background: '#1e293b', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>/</kbd> to open
          </motion.div>
        )}

        {/* ── FAB ── */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((o) => !o)}
          style={{
            position: 'relative',
            width: 54, height: 54,
            borderRadius: 16, border: 'none',
            background: open
              ? '#1e293b'
              : 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
            color: '#fff', cursor: 'pointer',
            boxShadow: open
              ? 'none'
              : '0 0 30px rgba(14,165,233,0.35), 0 8px 24px rgba(0,0,0,0.4)',
            transition: 'background 0.3s, box-shadow 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles size={20} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread dot */}
          {hasUnread && !open && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: -3, right: -3,
                width: 14, height: 14, borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #020817',
                boxShadow: '0 0 8px #10b981',
              }}
            />
          )}
        </motion.button>

      </motion.div>
    </>
  )
}
