import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, Loader2, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canAccess, setCanAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check subscription status on mount
  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated || !user?.uid) {
        setCheckingAccess(false);
        return;
      }

      try {
        const response = await api.get('/portal/access-status');
        console.log('Access status response:', response.data); 
        setCanAccess(response.data?.canUseAIChat || false);
      } catch (err) {
        console.error('Failed to check access:', err);
        setCanAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [isAuthenticated, user]);
  

  const sendMessage = async () => {
    if (!input.trim() || loading || !canAccess) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/ai-chat/personalized', {
        messages: [
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: input },
        ],
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.data?.message || response.data.data?.content || response.data?.message || 'No response',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send message';
      setError(errorMessage);
      
      // Remove user message if API call failed
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center p-8 rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="text-center">
          <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to use AI Chat</p>
        </div>
      </div>
    );
  }

  if (checkingAccess) {
    return (
      <div className="h-full flex items-center justify-center p-8 rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 rounded-xl border border-border/50 bg-gradient-to-br from-card/95 via-card to-accent/30 backdrop-blur-xl">
        <Lock className="w-12 h-12 text-primary mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Upgrade to LUMINARY</h3>
        <p className="text-muted-foreground mb-4 text-center">
          Access personalized AI astrology analysis powered by your birth chart data
        </p>
        <Link
          to="/subscribe"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Subscribe Now
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border/40 bg-gradient-to-r from-primary/90 to-primary/70">
        <h2 className="text-lg font-semibold text-primary-foreground">Astro AI Assistant</h2>
        <p className="text-sm text-primary-foreground/80">Personalized insights based on your birth chart</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/70 rounded-full flex items-center justify-center mx-auto mb-3 border border-border/40">
                <span className="text-xl">✨</span>
              </div>
              <p className="text-foreground font-medium mb-1">Welcome to Astro AI</p>
              <p className="text-sm text-muted-foreground">Ask questions about your birth chart, future, or personality</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-accent/70 text-foreground rounded-bl-none border border-border/40'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className={`text-xs mt-1 block ${message.role === 'user' ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-accent/70 text-foreground px-4 py-2 rounded-lg rounded-bl-none border border-border/40">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-destructive/30">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/40">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about your birth chart..."
            disabled={loading || !canAccess}
            className="flex-1 px-4 py-2 rounded-lg bg-background/70 border border-border/60 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || !canAccess}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
