import SponsorManager from "@/components/admin/SponsorManager";
import SponsorAnalytics from "@/components/admin/SponsorAnalytics";

export default function SponsorsPage() {
  return (
    <div className="space-y-6">
      <SponsorManager />
      <SponsorAnalytics />
    </div>
  );
}
