"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"

interface ChatMessage {
    role: "user" | "assistant"
    content: string
}

const N8N_CHAT_URL =
    (process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "http://localhost:5678") +
    "/webhook/rag-chatbot/chat"

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Generate a unique session ID on mount
    useEffect(() => {
        setSessionId(`session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)
    }, [])

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    const sendMessage = useCallback(async () => {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return

        const userMsg: ChatMessage = { role: "user", content: trimmed }
        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch(N8N_CHAT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "sendMessage",
                    chatInput: trimmed,
                    sessionId,
                }),
            })

            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            const data = await res.json()
            const answer = data.output || data.text || data.response || "Maaf, saya tidak bisa menjawab saat ini."
            setMessages((prev) => [...prev, { role: "assistant", content: answer }])
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "⚠️ Gagal terhubung ke server. Coba lagi nanti." },
            ])
        } finally {
            setIsLoading(false)
        }
    }, [input, isLoading, sessionId])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <>
            {/* Floating Chat Button */}
            <button
                id="chatbot-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                style={{
                    background: "linear-gradient(135deg, #0a0a0a 0%, #333 100%)",
                    color: "#fff",
                }}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                <div
                    className="transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                </div>
            </button>

            {/* Chat Panel */}
            <div
                className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-300"
                style={{
                    width: isOpen ? "380px" : "0px",
                    height: isOpen ? "520px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "scale(1) translateY(0)" : "scale(0.8) translateY(20px)",
                    transformOrigin: "bottom right",
                    border: "1px solid #e5e5e5",
                    background: "#ffffff",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center gap-3 px-5 py-4"
                    style={{
                        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
                        color: "#fff",
                    }}
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                        <Bot size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold leading-tight">Portfolio Assistant</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                            Tanya apapun tentang portfolio saya
                        </p>
                    </div>
                    <div className="flex h-2.5 w-2.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4" style={{ background: "#fafafa" }}>
                    {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center" style={{ color: "#999" }}>
                            <Bot size={40} strokeWidth={1.5} />
                            <div>
                                <p className="text-sm font-medium" style={{ color: "#555" }}>Halo! 👋</p>
                                <p className="mt-1 text-xs leading-relaxed">
                                    Saya asisten portfolio Al Fauzi.
                                    <br />
                                    Tanya tentang project, skill, atau pengalaman!
                                </p>
                            </div>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                {["Apa saja project?", "Skill apa yang dimiliki?", "Ceritakan pengalaman kerja"].map(
                                    (q) => (
                                        <button
                                            key={q}
                                            onClick={() => {
                                                setInput(q)
                                                setTimeout(() => inputRef.current?.focus(), 50)
                                            }}
                                            className="rounded-full px-3 py-1.5 text-xs transition-colors hover:opacity-80"
                                            style={{
                                                background: "#f0f0f0",
                                                color: "#333",
                                                border: "1px solid #e0e0e0",
                                            }}
                                        >
                                            {q}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`mb-3 flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            <div
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                style={{
                                    background: msg.role === "user" ? "#0a0a0a" : "#e5e5e5",
                                    color: msg.role === "user" ? "#fff" : "#333",
                                }}
                            >
                                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div
                                className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                                style={{
                                    background: msg.role === "user" ? "#0a0a0a" : "#ffffff",
                                    color: msg.role === "user" ? "#fff" : "#1a1a1a",
                                    border: msg.role === "assistant" ? "1px solid #e5e5e5" : "none",
                                    borderRadius:
                                        msg.role === "user"
                                            ? "20px 20px 4px 20px"
                                            : "20px 20px 20px 4px",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="mb-3 flex items-start gap-2">
                            <div
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                style={{ background: "#e5e5e5", color: "#333" }}
                            >
                                <Bot size={14} />
                            </div>
                            <div
                                className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm"
                                style={{
                                    background: "#fff",
                                    border: "1px solid #e5e5e5",
                                    borderRadius: "20px 20px 20px 4px",
                                    color: "#999",
                                }}
                            >
                                <Loader2 size={14} className="animate-spin" />
                                Sedang berpikir...
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div
                    className="flex items-center gap-2 px-4 py-3"
                    style={{ borderTop: "1px solid #e5e5e5", background: "#fff" }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ketik pertanyaan..."
                        disabled={isLoading}
                        className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none transition-colors"
                        style={{
                            background: "#f5f5f5",
                            border: "1px solid #e5e5e5",
                            color: "#1a1a1a",
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-40"
                        style={{
                            background: input.trim() && !isLoading ? "#0a0a0a" : "#d4d4d4",
                            color: "#fff",
                        }}
                        aria-label="Send message"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </>
    )
}
