"use client"

import * as React from "react"
import {
  Crown,
  Hash,
  Heart,
  MessageCircle,
  Pin,
  SendHorizontal,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"

import {
  channels,
  communityPosts,
  members,
  type CommunityPost,
} from "@cancel/data"
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  Separator,
  Textarea,
  cn,
} from "@cancel/ui"

import { useUserStore } from "@/lib/stores/user"

const roleStyle: Record<string, string> = {
  Fundador: "bg-primary/10 text-primary",
  Pro: "bg-info-soft text-info",
  "Realtor verificado": "bg-success-soft text-success",
  Miembro: "bg-muted text-muted-foreground",
}

export default function ComunidadPage() {
  const [channel, setChannel] = React.useState("general")
  const [posts, setPosts] = React.useState<CommunityPost[]>(communityPosts)
  const [draft, setDraft] = React.useState("")
  const [openComments, setOpenComments] = React.useState<string | null>(null)
  const [commentDraft, setCommentDraft] = React.useState("")
  const name = useUserStore((s) => s.profile.name)

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "TU"

  const visible = posts
    .filter((p) => p.channel === channel)
    .sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false))

  const publish = () => {
    if (!draft.trim()) return
    setPosts((cur) => [
      {
        id: `post-${Date.now()}`,
        channel,
        author: name || "Tú",
        initials,
        role: "Miembro",
        time: "Ahora",
        content: draft.trim(),
        likes: 0,
        comments: [],
      },
      ...cur,
    ])
    setDraft("")
    toast.success("Publicado en la comunidad")
  }

  const toggleLike = (id: string) =>
    setPosts((cur) =>
      cur.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      )
    )

  const addComment = (id: string) => {
    if (!commentDraft.trim()) return
    setPosts((cur) =>
      cur.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c-${Date.now()}`,
                  author: name || "Tú",
                  initials,
                  content: commentDraft.trim(),
                  time: "Ahora",
                },
              ],
            }
          : p
      )
    )
    setCommentDraft("")
  }

  const activeChannel = channels.find((c) => c.id === channel)

  return (
    <div className="grid gap-5 lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr_240px] animate-fade-in">
      {/* Canales */}
      <aside className="space-y-1 max-lg:flex max-lg:gap-1.5 max-lg:overflow-x-auto max-lg:pb-1">
        {channels.map((c) => {
          const count = posts.filter((p) => p.channel === c.id).length
          return (
            <button
              key={c.id}
              onClick={() => setChannel(c.id)}
              aria-current={channel === c.id ? "true" : undefined}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium whitespace-nowrap transition-colors max-lg:w-auto",
                channel === c.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Hash className="size-3.5 shrink-0" />
              {c.name}
              <span className={cn(
                "ml-auto rounded-full px-1.5 text-[10px] font-semibold max-lg:hidden",
                channel === c.id ? "bg-background/60" : "bg-muted"
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </aside>

      {/* Feed */}
      <div className="min-w-0 space-y-4">
        {/* Composer */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-2.5">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Comparte en #${activeChannel?.name}… un deal, una pregunta, un win`}
                  rows={2}
                  className="resize-none"
                />
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] text-muted-foreground">
                    Data real &gt; humo — incluye números si puedes
                  </p>
                  <Button size="sm" disabled={!draft.trim()} onClick={publish}>
                    <SendHorizontal className="size-3.5" />
                    Publicar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts — feed por hairlines, ritmo de lectura (Threads), no cards pesadas */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {visible.map((post, i) => (
            <article
              key={post.id}
              className={cn(
                "p-4 transition-colors hover:bg-muted/30 sm:p-5",
                i > 0 && "border-t border-border/70",
                post.pinned && "bg-primary/[0.03]"
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback
                    className={cn(
                      "text-xs font-bold",
                      post.role === "Fundador"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {post.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[13px] font-semibold">{post.author}</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                        roleStyle[post.role]
                      )}
                    >
                      {post.role === "Fundador" && <Crown className="size-2.5" />}
                      {post.role === "Realtor verificado" && (
                        <ShieldCheck className="size-2.5" />
                      )}
                      {post.role}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {post.time}
                    </span>
                    {post.pinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                        <Pin className="size-3" />
                        Fijado
                      </span>
                    )}
                    {post.tag && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                        {post.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/90">
                    {post.content}
                  </p>

                  <div className="mt-3 flex items-center gap-1">
                    <button
                      onClick={() => toggleLike(post.id)}
                      aria-label={`Me gusta — ${post.likes}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <Heart className="size-3.5" />
                      {post.likes}
                    </button>
                    <button
                      onClick={() =>
                        setOpenComments(openComments === post.id ? null : post.id)
                      }
                      aria-label={`Comentarios — ${post.comments.length}`}
                      aria-expanded={openComments === post.id}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <MessageCircle className="size-3.5" />
                      {post.comments.length}
                    </button>
                  </div>

                  {/* Comentarios */}
                  {openComments === post.id && (
                    <div className="mt-3 space-y-3 animate-fade-in">
                      <Separator />
                      {post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2.5">
                          <Avatar className="size-7 shrink-0">
                            <AvatarFallback className="bg-muted text-[10px] font-bold">
                              {c.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 rounded-xl bg-muted/60 px-3 py-2">
                            <p className="text-[11px] font-semibold">
                              {c.author}
                              <span className="ml-2 font-normal text-muted-foreground">
                                {c.time}
                              </span>
                            </p>
                            <p className="mt-0.5 text-[12.5px] leading-relaxed">
                              {c.content}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Avatar className="size-7 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <input
                          value={commentDraft}
                          onChange={(e) => setCommentDraft(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                          placeholder="Escribe un comentario…"
                          aria-label="Escribe un comentario"
                          className="h-9 flex-1 rounded-full border border-input bg-transparent px-3.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}

          {visible.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <MessageCircle className="size-8 text-muted-foreground/50" />
              <p className="font-medium">Todavía no hay posts en #{activeChannel?.name}</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Sé el primero — una pregunta buena aquí te ahorra miles en el
                próximo deal.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Miembros */}
      <aside className="space-y-3 max-xl:hidden">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Miembros · {members.filter((m) => m.online).length} en línea
            </p>
            <div className="mt-3 space-y-2.5">
              {members.map((m) => (
                <div key={m.name} className="flex items-center gap-2.5">
                  <div className="relative">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-muted text-[10px] font-bold">
                        {m.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      aria-label={m.online ? "En línea" : "Ausente"}
                      className={cn(
                        "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card",
                        m.online ? "bg-success animate-pulse-dot" : "bg-muted-foreground/40"
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium">{m.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {m.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/8 to-transparent shadow-card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold">Regla de la casa</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Aquí se comparte data, no humo. Los deals que se discuten usan
              comparables reales de la plataforma.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
