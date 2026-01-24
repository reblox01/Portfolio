import { getAdminDetail } from "@/actions/admin.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  MessageCircle,
  Gitlab,
  Twitter,
  Mail,
  Youtube,
  FileText,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { socialUrl, normalizeHandle, withProtocol } from "@/lib/utils/social-utils";

export default async function ManageAdminPage() {
  const admin = await getAdminDetail();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Admin</h1>
        <div className="flex gap-2">
          {!admin ? (
            <Button asChild>
              <Link href="/dashboard/manage-admin/new">Add admin</Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/dashboard/manage-admin/edit">Edit admin</Link>
            </Button>
          )}
        </div>
      </div>

      {!admin ? (
        <p className="text-muted-foreground">No admin found yet.</p>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={admin.imageUrl || undefined} alt={admin.name} />
                  <AvatarFallback>{admin.name?.charAt(0) ?? "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl leading-tight">{admin.name}</CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="font-normal">{admin.position}</Badge>
                    {admin.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {admin.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <div className="text-sm text-muted-foreground">Introduction</div>
              <p className="mt-1 whitespace-pre-wrap">{admin.introduction}</p>
            </section>
            <section>
              <div className="text-sm text-muted-foreground">Education</div>
              <p className="mt-1 whitespace-pre-wrap">{admin.education}</p>
            </section>
            {(admin.email || admin.resumeUrl) && (
              <section className="flex flex-wrap gap-2">
                {admin.email && (
                  <Button asChild variant="outline">
                    <a href={`mailto:${admin.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      {admin.email}
                    </a>
                  </Button>
                )}
                {admin.resumeUrl && (
                  <Button asChild>
                    <a
                      href={withProtocol(admin.resumeUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </a>
                  </Button>
                )}
              </section>
            )}
            {Array.isArray(admin.skills) && (admin.skills as any[]).length > 0 && (
              <section>
                <div className="text-sm text-muted-foreground mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {(admin.skills as any[]).map((s: any) => (
                    <Badge key={s?.id ?? String(s)} variant="outline">{s?.text ?? String(s)}</Badge>
                  ))}
                </div>
              </section>
            )}
            {
              // Social links
            }
            {(() => {
              const socials: { key: keyof typeof admin; label: string; icon: any }[] = [
                { key: "github", label: "GitHub", icon: Github },
                { key: "linkedIn", label: "LinkedIn", icon: Linkedin },
                { key: "facebook", label: "Facebook", icon: Facebook },
                { key: "instagram", label: "Instagram", icon: Instagram },
                { key: "discord", label: "Discord", icon: MessageCircle },
                { key: "gitlab", label: "GitLab", icon: Gitlab },
                { key: "twitter", label: "Twitter", icon: Twitter },
                { key: "youtube", label: "YouTube", icon: Youtube },
              ];
              const items = socials
                .map((s) => ({
                  ...s,
                  handle: normalizeHandle((admin as any)?.[s.key] as string | undefined),
                  url: socialUrl(s.key as string, (admin as any)?.[s.key] as string | undefined),
                }))
                .filter((s) => !!s.url);
              if (items.length === 0) return null;
              return (
                <section>
                  <div className="text-sm text-muted-foreground mb-2">Social</div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <Button key={s.label} asChild variant="outline">
                        <a href={withProtocol(s.url)} target="_blank" rel="noreferrer" className="inline-flex items-center">
                          <s.icon className="mr-2 h-4 w-4" />
                          @{s.handle}
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </section>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


