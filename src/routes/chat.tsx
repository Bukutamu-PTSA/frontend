import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Video,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat Layanan — PTSA-KEMNAKER" },
      {
        name: "description",
        content: "Ruangan percakapan layanan pengaduan ketenagakerjaan.",
      },
      { property: "og:title", content: "Chat Layanan — PTSA-KEMNAKER" },
      {
        property: "og:description",
        content: "Ruangan percakapan layanan pengaduan ketenagakerjaan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
}

interface ChatThread {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

const initialThreads: ChatThread[] = [
  {
    id: "1",
    name: "Budi Santoso",
    role: "Pelapor WLKP",
    avatar: "BS",
    lastMessage: "Baik, saya tunggu konfirmasinya.",
    time: "09:15",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", sender: "them", text: "Selamat pagi, saya mau tanya soal laporan WLKP saya.", time: "09:05" },
      { id: "m2", sender: "me", text: "Pagi Pak Budi, silakan. Bisa saya bantu?", time: "09:08" },
      { id: "m3", sender: "them", text: "Statusnya masih diproses, kira-kira berapa lama ya?", time: "09:10" },
      { id: "m4", sender: "me", text: "Biasanya 3–5 hari kerja. Saya cek dulu ya.", time: "09:12" },
      { id: "m5", sender: "them", text: "Baik, saya tunggu konfirmasinya.", time: "09:15" },
    ],
  },
  {
    id: "2",
    name: "Dewi Lestari",
    role: "Operator Wilayah",
    avatar: "DL",
    lastMessage: "Data provinsi sudah saya update.",
    time: "Kem",
    unread: 0,
    online: true,
    messages: [
      { id: "m1", sender: "them", text: "Halo, saya sudah selesai verifikasi data provinsi.", time: "Kem" },
      { id: "m2", sender: "me", text: "Terima kasih, Dewi.", time: "Kem" },
      { id: "m3", sender: "them", text: "Data provinsi sudah saya update.", time: "Kem" },
    ],
  },
  {
    id: "3",
    name: "Ahmad Rizky",
    role: "Pelapor Upah",
    avatar: "AR",
    lastMessage: "Saya lampirkan bukti transfernya.",
    time: "Kem",
    unread: 1,
    online: false,
    messages: [
      { id: "m1", sender: "them", text: "Selamat sore, ini bukti transfer gaji yang belum dibayar.", time: "Kem" },
      { id: "m2", sender: "me", text: "Sore Pak, terima kasih. Saya teruskan ke tim verifikasi.", time: "Kem" },
      { id: "m3", sender: "them", text: "Saya lampirkan bukti transfernya.", time: "Kem" },
    ],
  },
  {
    id: "4",
    name: "Tim Verifikasi",
    role: "Internal",
    avatar: "TV",
    lastMessage: "Ada 12 laporan menunggu review.",
    time: "Sen",
    unread: 0,
    online: true,
    messages: [
      { id: "m1", sender: "them", text: "Halo admin, ada 12 laporan menunggu review.", time: "Sen" },
      { id: "m2", sender: "me", text: "Oke, saya cek segera.", time: "Sen" },
    ],
  },
  {
    id: "5",
    name: "Siti Aminah",
    role: "Pelapor Jamsos",
    avatar: "SA",
    lastMessage: "Terima kasih atas bantuannya.",
    time: "Sen",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", sender: "them", text: "Permisi, BPJS Ketenagakerjaan saya belum aktif.", time: "Sen" },
      { id: "m2", sender: "me", text: "Bisa sertakan NIK dan nama perusahaan?", time: "Sen" },
      { id: "m3", sender: "them", text: "Sudah saya kirim via email.", time: "Sen" },
      { id: "m4", sender: "me", text: "Baik, kami proses.", time: "Sen" },
      { id: "m5", sender: "them", text: "Terima kasih atas bantuannya.", time: "Sen" },
    ],
  },
];

function ChatPage() {
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
  const [activeId, setActiveId] = useState<string>(initialThreads[0]!.id);
  const [input, setInput] = useState("");
  const [showList, setShowList] = useState(true);

  const activeThread = threads.find((t) => t.id === activeId) || initialThreads[0]!;

  const handleSelect = (id: string) => {
    setActiveId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t))
    );
    if (window.innerWidth < 1024) setShowList(false);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "me",
      text,
      time,
      status: "sent",
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              lastMessage: text,
              time,
            }
          : t
      )
    );
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppShell title="Chat Layanan" breadcrumb="Chat">
      <div className="card-surface -mx-4 -my-6 overflow-hidden sm:mx-0 sm:my-0">
        <div className="flex h-[calc(100vh-11rem)] min-h-[480px]">
          {/* Sidebar daftar chat */}
          <aside
            className={cn(
              "flex w-full flex-col border-r border-border bg-muted/30 lg:w-80",
              showList ? "block" : "hidden lg:flex"
            )}
          >
            <div className="border-b border-border px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari percakapan…"
                  className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => handleSelect(thread.id)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60",
                    activeId === thread.id && "bg-accent"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-brand text-sm font-semibold text-primary-foreground">
                      {thread.avatar}
                    </div>
                    {thread.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-success" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        {thread.name}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {thread.time}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {thread.role}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-foreground/80">
                      {thread.lastMessage}
                    </p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="mt-1 shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {thread.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Area percakapan */}
          <section
            className={cn(
              "flex flex-1 flex-col bg-surface",
              showList ? "hidden lg:flex" : "flex"
            )}
          >
            {/* Header chat */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowList(true)}
                  className="rounded-lg p-1.5 hover:bg-accent lg:hidden"
                  aria-label="Kembali ke daftar chat"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="relative">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">
                    {activeThread.avatar}
                  </div>
                  {activeThread.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {activeThread.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {activeThread.online ? "Aktif" : "Terakhir dilihat kemarin"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Video className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Pesan */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="mx-auto max-w-3xl space-y-4">
                {activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                        msg.sender === "me"
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm bg-muted text-foreground"
                      )}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={cn(
                          "mt-1 text-right text-[10px]",
                          msg.sender === "me"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border px-4 py-3">
              <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-muted p-2">
                <button className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan…"
                  className="min-h-[40px] flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="rounded-xl bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Kirim pesan"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
