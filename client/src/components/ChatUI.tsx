"use client";
import { ArrowUpRight, ChevronDown, Home, MapPin, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { TextUIPart, ToolUIPart, UIMessage } from "ai";
import Image from "next/image";

const KEYFRAMES = `
  @keyframes blink {
    0%,80%,100% { opacity:.2; transform:scale(.8); }
    40%         { opacity:1;  transform:scale(1);  }
  }
  @keyframes msgIn {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0);   }
  }
  .animate-blink-0 { animation: blink 1.2s 0s   infinite ease-in-out; }
  .animate-blink-1 { animation: blink 1.2s .2s  infinite ease-in-out; }
  .animate-blink-2 { animation: blink 1.2s .4s  infinite ease-in-out; }
  .animate-msg-in  { animation: msgIn 180ms ease both; }
`;

interface Suggestion {
  label: string;
  detail: string;
  prompt: string;
}

interface SearchCriteria {
  max_price: number | null;
  bedrooms: number[] | null;
  neighborhoods: string[] | null;
}

interface SearchListingInput extends SearchCriteria {
  must_be_verified: boolean;
}

interface ListingCard {
  id: string;
  url: string;
  price: number;
  bedrooms: number;
  address?: string | null;
  name?: string | null;
  neighborhood?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  imageUrls?: string[];
  images?: string[];
}

interface SearchListingsOutput {
  extracted_criteria: SearchCriteria;
  matchCount: number;
  listings: ListingCard[];
}

type ChatTools = {
  searchListings: {
    input: SearchListingInput;
    output: SearchListingsOutput;
  };
};

type ChatMessage = UIMessage<unknown, never, ChatTools>;
type SearchListingsToolPart = ToolUIPart<ChatTools>;

const isTextPart = (part: ChatMessage["parts"][number]): part is TextUIPart =>
  part.type === "text";

const isSearchListingsToolPart = (
  part: ChatMessage["parts"][number],
): part is SearchListingsToolPart => part.type === "tool-searchListings";

const getListingImageSrc = (listing: ListingCard): string | null => {
  if (listing.imageUrl) return listing.imageUrl;
  if (listing.image) return listing.image;
  if (listing.imageUrls?.[0]) return listing.imageUrls[0];
  if (listing.images?.[0]) return listing.images[0];
  return null;
};

const suggestions: Suggestion[] = [
  {
    label: "Budget",
    detail: "Studio under $2,300",
    prompt: "Find me a studio under $2,300 in Mission, SoMA, or nearby.",
  },
  {
    label: "Neighborhood",
    detail: "Quiet 1-bedroom in Hayes Valley",
    prompt:
      "I’m looking for a quiet 1-bedroom in Hayes Valley, Lower Haight, or nearby.",
  },
  {
    label: "Preferences",
    detail: "Pet-friendly, good commute",
    prompt:
      "Find pet-friendly apartments with a reasonable commute to downtown San Francisco.",
  },
];

const TypingBubble = () => {
  return (
    <div className="animate-msg-in flex items-end gap-2.5">
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-wesh-ink text-wesh-mint shadow-sm">
        <span className="text-[11px] font-semibold">W</span>
      </div>
      <div className="rounded-[18px_18px_18px_4px] border border-border bg-background px-4 py-3.5 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="animate-blink-0 size-1.5 rounded-full bg-muted-foreground" />
          <span className="animate-blink-1 size-1.5 rounded-full bg-muted-foreground" />
          <span className="animate-blink-2 size-1.5 rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

const Message = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  const textParts = message.parts.filter(isTextPart);
  const toolParts = message.parts.filter(isSearchListingsToolPart);

  return (
    <div
      className={`animate-msg-in flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center self-start rounded-full bg-wesh-ink text-wesh-mint shadow-sm">
          <span className="text-[11px] font-semibold">W</span>
        </div>
      )}

      <div
        className={`flex max-w-[85%] flex-col gap-3 rounded-[18px] px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-lg bg-wesh-pine text-white shadow-wesh-pine/10"
            : "rounded-bl-lg border border-border bg-background text-foreground"
        }`}
      >
        {/* Render Text Parts */}
        {textParts.length > 0 && (
          <div className="flex flex-col gap-2">
            {textParts.map((part, index) => (
              <span
                key={`text-${index}`}
                className="whitespace-pre-wrap wrap-break-word"
              >
                {part.text}
              </span>
            ))}
          </div>
        )}

        {/* Render Tool Parts with Rich Media Cards */}
        {toolParts.map((part) => {
          const { type, toolCallId, state, output } = part;

          if (type === "tool-searchListings") {
            if (state === "input-streaming" || state === "input-available") {
              return (
                <div
                  key={toolCallId}
                  className="my-2 flex w-fit items-center gap-2 rounded-full border border-wesh-teal/30 bg-wesh-teal/10 px-3 py-2 text-xs font-medium text-wesh-teal shadow-sm"
                >
                  <div className="size-3 animate-spin rounded-full border-2 border-wesh-teal border-t-transparent" />
                  Searching real-time database...
                </div>
              );
            }

            if (state === "output-available") {
              return (
                <div
                  key={toolCallId}
                  className="mt-1 flex flex-col gap-3 w-full"
                >
                  {output?.listings && output.listings.length > 0 && (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 w-full">
                      {output.listings.map((listing) => {
                        const imageSrc = getListingImageSrc(listing);
                        const listingTitle =
                          listing.address ?? listing.name ?? "Rental listing";

                        return (
                          <a
                            key={listing.id}
                            href={listing.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block outline-none"
                          >
                            <Card className="group relative h-64 cursor-pointer overflow-hidden rounded-xl border-border/60 bg-muted transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-wesh-teal/10 sm:h-72">
                              {/* Background Image */}
                              {imageSrc ? (
                                <Image
                                  src={imageSrc}
                                  alt={listingTitle}
                                  fill
                                  unoptimized
                                  className="object-cover transition-transform duration-700 group-hover:scale-110 z-0"
                                />
                              ) : (
                                <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground/50">
                                  <Home className="size-8 stroke-[1.5]" />
                                  <span className="text-xs">No image</span>
                                </div>
                              )}

                              {/* Dark Gradient Overlay */}
                              <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/40 to-black/0 transition-opacity duration-300 group-hover:opacity-90" />

                              {/* Text Content */}
                              <CardContent className="relative z-20 flex h-full flex-col justify-end gap-2 p-4">
                                <div>
                                  <h4 className="line-clamp-1 text-sm font-semibold text-white drop-shadow-md transition-colors group-hover:text-wesh-mint">
                                    {listingTitle}
                                  </h4>
                                  <p className="mt-1 text-[11px] font-medium text-zinc-300 drop-shadow-sm">
                                    {listing.neighborhood || "San Francisco"} •{" "}
                                    {listing.bedrooms === 0
                                      ? "Studio"
                                      : `${listing.bedrooms} BR`}
                                  </p>
                                </div>

                                <div className="mt-1 flex items-center justify-between border-t border-white/20 pt-3">
                                  <span className="text-sm font-bold text-white drop-shadow-md">
                                    ${listing.price.toLocaleString()}
                                    <span className="text-[11px] font-normal text-zinc-300">
                                      /mo
                                    </span>
                                  </span>

                                  {/* Animated Icon Button */}
                                  <div className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-wesh-teal">
                                    <ArrowUpRight className="size-3.5 text-white" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    </div>
  );
};

const ChatUI = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat<ChatMessage>();
  const isLoading = status === "submitted" || status === "streaming";

  const [showScroll, setShowScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasMessage = messages.length > 0;

  const resizeTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 96) + "px";
  };

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!isLoading) scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleScroll = () => {
    const el = messagesAreaRef.current;
    if (!el) return;
    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <section className="relative overflow-hidden bg-background" id="chat">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
        <div className="container py-16 md:py-20 lg:py-24">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-medium text-wesh-teal">
              Apartment brief
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              Tell Wesh what would make a place worth seeing.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              Start with the details you already know: budget, bedrooms or
              neighborhoods
            </p>
          </div>

          <div className="relative mx-auto flex h-[76vh] min-h-120 max-h-205 max-w-5xl flex-col overflow-hidden rounded-4xl border border-border bg-card shadow-[0_28px_90px_rgba(9,20,19,0.10)]">
            <div className="flex items-center justify-between border-b border-border/70 bg-background/75 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-wesh-ink text-wesh-mint">
                  <span className="text-xs font-semibold">W</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Wesh</p>
                  <p className="text-xs text-muted-foreground">
                    San Francisco rental monitoring
                  </p>
                </div>
              </div>

              <p className="hidden text-xs font-medium text-muted-foreground sm:block">
                Ask by budget, bedrooms or neighborhood
              </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
              {/* Scrollable Chat Message Canvas */}
              <div
                ref={messagesAreaRef}
                onScroll={handleScroll}
                className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] [scrollbar-width:thin]"
              >
                {!hasMessage && (
                  <div className="my-auto flex flex-1 flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-wesh-ink text-wesh-mint shadow-sm">
                      <span className="text-sm font-semibold">W</span>
                    </div>
                    <h3 className="mb-2 font-display text-3xl font-semibold text-foreground">
                      Describe the apartment you want
                    </h3>
                    <p className="mb-6 max-w-md text-sm leading-6 text-muted-foreground">
                      Start with budget, bedrooms, neighborhoods, commute, pets,
                      or anything that would make a place worth seeing.
                    </p>
                    <div className="grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-2xl border border-border bg-background/80 text-left shadow-sm md:grid-cols-3">
                      {suggestions.map((item) => {
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => sendMessage({ text: item.prompt })}
                            className="group border-b border-border p-4 transition-colors hover:bg-card md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0"
                          >
                            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-wesh-teal">
                              {item.label}
                            </span>
                            <span className="block text-sm font-medium leading-5 text-foreground">
                              {item.detail}
                            </span>
                            <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                              {item.prompt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {hasMessage && (
                  <>
                    {messages.map((message) => (
                      <Message key={message.id} message={message} />
                    ))}
                    {isLoading &&
                      messages[messages.length - 1]?.role === "user" && (
                        <TypingBubble />
                      )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Floating scroll-to-bottom pill */}
              <Button
                onClick={() => scrollToBottom()}
                className={`absolute bottom-32 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full bg-wesh-ink p-2 text-xs text-wesh-mint shadow-md transition-opacity duration-150 ${
                  showScroll
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <ChevronDown className="size-3.5" />
              </Button>

              {/* Input Action Form Area */}
              <div className="mt-3 border-t border-border/60 pt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      sendMessage({ text: input });
                      setInput("");
                    }
                  }}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 shadow-sm transition-colors focus-within:border-wesh-teal/50 focus-within:ring-4 focus-within:ring-wesh-mint/30"
                >
                  <textarea
                    className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="Ask Wesh for a studio under $2,300 in Mission..."
                    value={input}
                    rows={1}
                    disabled={isLoading}
                    ref={textareaRef}
                    onChange={(e) => {
                      setInput(e.target.value);
                      resizeTextarea();
                    }}
                    // onPageChange={() => {}}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim() && !isLoading) {
                          sendMessage({ text: input });
                          setInput("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-wesh-pine p-0 text-white hover:bg-wesh-teal"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : <Send className="size-4" />}
                  </Button>
                </form>

                {/* Geo Scope Footer Info Indicator */}
                <div className="mx-auto mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <MapPin className="size-3.5 text-wesh-teal" />
                  Focused on San Francisco rentals, expanding soon
                  <ArrowUpRight className="size-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatUI;
