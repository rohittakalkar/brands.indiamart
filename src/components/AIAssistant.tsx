import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, ShoppingBag, MapPin, Layers, Check, Loader2 } from 'lucide-react';
import { BuyLead } from '../types';

interface AIAssistantProps {
  onAutoFillLead: (lead: Partial<BuyLead>) => void;
  onSelectBrand: (brandId: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  recommendedBrandId?: string;
  recommendedCategory?: string;
  draftedBuyLead?: {
    productName: string;
    brandName?: string;
    quantity: string;
    location: string;
    requirement: string;
  };
}

export default function AIAssistant({ onAutoFillLead, onSelectBrand, onSelectCategory }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hello! I'm your **IndiaMART Brands AI Assistant**.\n\nTell me what B2B products or brands you're looking for! E.g. _'Need 50HP submersible pumps for heavy irrigation in Gujarat'_ or _'Compare Kirloskar vs KSB pumps for chemical usage.'_\n\nI can analyze specifications, suggest verified brands, and draft your BuyLead inquiry automatically!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgText = input;
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          previousMessages: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Could not connect to B2B assistant. Please try again.');
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date(),
        recommendedBrandId: data.recommendedBrandId,
        recommendedCategory: data.recommendedCategory,
        draftedBuyLead: data.draftedBuyLead
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* AI Assistant Header */}
      <div className="bg-gradient-to-r from-[#028384] to-[#005e60] px-4 py-3.5 text-white flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-300 fill-teal-300/20" />
          <div>
            <h2 className="font-bold text-sm leading-none">IndiaMART Smart AI</h2>
            <span className="text-[10px] text-teal-50 font-medium">Verified Brand & RFQ Companion</span>
          </div>
        </div>
        <div className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
          Gemini 3.5
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-zinc-800 text-white' : 'bg-teal-50 text-[#028384]'}`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Content Bubble */}
                <div className="flex flex-col gap-1.5">
                  <div className={`rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${isUser ? 'bg-[#028384] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                    <div className="whitespace-pre-line prose prose-sm prose-teal max-w-none">
                      {/* Simple markdown parsing for bold text */}
                      {msg.text.split('\n').map((line, lIdx) => {
                        // Very simple bold replacement **text**
                        let formattedLine = line;
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        const matches = [...formattedLine.matchAll(boldRegex)];
                        
                        if (matches.length > 0) {
                          return (
                            <p key={lIdx} className="mb-1">
                              {formattedLine.split('**').map((part, pIdx) => 
                                pIdx % 2 === 1 ? <strong key={pIdx} className={isUser ? "text-white font-extrabold" : "text-slate-900 font-extrabold"}>{part}</strong> : part
                              )}
                            </p>
                          );
                        }
                        return <p key={lIdx} className="mb-1">{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Recommendation Actions inside AI response */}
                  {!isUser && (msg.recommendedBrandId || msg.recommendedCategory || msg.draftedBuyLead) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2.5 shadow-sm text-xs">
                      <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                        <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>AI Recommended Shortcuts</span>
                      </div>

                      {/* Brand Shortcut */}
                      {msg.recommendedBrandId && msg.recommendedBrandId !== 'all' && (
                        <button
                          onClick={() => onSelectBrand(msg.recommendedBrandId!)}
                          className="w-full flex items-center justify-between px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-lg text-slate-700 font-semibold transition text-[11px]"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                            View Brand Profile ({msg.recommendedBrandId.toUpperCase()})
                          </span>
                          <span className="text-amber-700 font-bold">&rarr;</span>
                        </button>
                      )}

                      {/* Category Shortcut */}
                      {msg.recommendedCategory && (
                        <button
                          onClick={() => onSelectCategory(msg.recommendedCategory!)}
                          className="w-full flex items-center justify-between px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-lg text-slate-700 font-semibold transition text-[11px]"
                        >
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-amber-600" />
                            Browse {msg.recommendedCategory.toUpperCase()} Category
                          </span>
                          <span className="text-amber-700 font-bold">&rarr;</span>
                        </button>
                      )}

                      {/* Drafted BuyLead Action */}
                      {msg.draftedBuyLead && (
                        <div className="border-t border-amber-200 pt-2 space-y-1.5">
                          <span className="text-[10px] text-amber-700 font-medium block">
                            Prepared inquiry for standard matching suppliers:
                          </span>
                          <div className="bg-white/80 border border-amber-100 rounded p-2 text-[10px] space-y-1 text-slate-600 font-mono">
                            <div><strong className="text-slate-800">Product:</strong> {msg.draftedBuyLead.productName}</div>
                            <div><strong className="text-slate-800">Qty:</strong> {msg.draftedBuyLead.quantity}</div>
                            {msg.draftedBuyLead.location && <div><strong className="text-slate-800">Location:</strong> {msg.draftedBuyLead.location}</div>}
                            <div className="line-clamp-2"><strong className="text-slate-800">Req:</strong> {msg.draftedBuyLead.requirement}</div>
                          </div>
                          <button
                            onClick={() => onAutoFillLead({
                              productName: msg.draftedBuyLead?.productName,
                              brandName: msg.draftedBuyLead?.brandName,
                              quantity: msg.draftedBuyLead?.quantity || '1 Piece',
                              location: msg.draftedBuyLead?.location || 'Pune, Maharashtra',
                              requirement: msg.draftedBuyLead?.requirement
                            })}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#028384] hover:bg-[#007072] text-white font-bold rounded-lg transition text-[11px] shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Instant Auto-Fill & Send Inquiry
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-50 text-[#028384] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#028384]" />
                <span>Gemini is analyzing brands & drafting RFQ...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold">AI Assistant Offline Mode</p>
              <p className="text-[11px] text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI or describe your B2B requirements..."
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#028384] focus:bg-white rounded-xl px-3 py-2 text-xs outline-none transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-[#028384] hover:bg-[#007072] disabled:bg-zinc-300 text-white p-2.5 rounded-xl transition shrink-0"
          disabled={!input.trim() || isLoading}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
