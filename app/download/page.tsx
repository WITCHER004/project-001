import type { Metadata } from "next";
import DownloadGateway from "@/components/DownloadGateway";
import { DEFAULT_DEEP_LINK } from "@/lib/appLinks";

export const metadata: Metadata = {
  title: "Get the Grabbo App",
  description:
    "Continue in the Grabbo app — scan to open on your phone, or grab it from the App Store or Google Play.",
};

/**
 * Deep-link fallback gateway. Grabbo's `grabbo://` links (see Events.tsx and
 * CartDrawerLuxury.tsx) redirect here after a short timeout if the app never
 * takes focus — i.e. it isn't installed. An optional `?target=` query param
 * carries the specific deep link the user was trying to reach, so the QR
 * code / retry button on this page can resume exactly where they left off
 * instead of just opening the app's home screen.
 */
export default function DownloadPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const rawTarget = searchParams?.target;
  const target = typeof rawTarget === "string" && rawTarget.length > 0 ? rawTarget : DEFAULT_DEEP_LINK;

  return (
    <main className="overflow-x-hidden">
      <DownloadGateway deepLink={target} />
    </main>
  );
}
