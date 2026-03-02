export default function GeoBreakdown({
  visitsByCountry,
  visitsByCity,
}: {
  visitsByCountry: Record<string, number>;
  visitsByCity: Record<string, number>;
}) {
  const countries = Object.entries(visitsByCountry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const cities = Object.entries(visitsByCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxCountry = countries.length > 0 ? countries[0][1] : 1;
  const maxCity = cities.length > 0 ? cities[0][1] : 1;

  const isEmpty = countries.length === 0 && cities.length === 0;

  return (
    <div className="bg-surface border border-border-dim rounded-lg p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
        Geographic Breakdown
      </p>
      {isEmpty ? (
        <p className="font-mono text-xs text-text-dim text-center py-8">
          No data yet
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Countries */}
          <div>
            <p className="font-mono text-[10px] text-text-dim mb-3 uppercase tracking-wider">
              By Country
            </p>
            <div className="space-y-2">
              {countries.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-mono text-xs text-text-secondary truncate mr-2">
                      {name}
                    </span>
                    <span className="font-mono text-[10px] text-neon-purple flex-shrink-0">
                      {count}
                    </span>
                  </div>
                  <div className="h-1 bg-surface-light rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / maxCountry) * 100}%`,
                        background:
                          "linear-gradient(to right, #a855f7, rgba(168,85,247,0.3))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <p className="font-mono text-[10px] text-text-dim mb-3 uppercase tracking-wider">
              By City
            </p>
            <div className="space-y-2">
              {cities.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-mono text-xs text-text-secondary truncate mr-2">
                      {name}
                    </span>
                    <span className="font-mono text-[10px] text-neon-amber flex-shrink-0">
                      {count}
                    </span>
                  </div>
                  <div className="h-1 bg-surface-light rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / maxCity) * 100}%`,
                        background:
                          "linear-gradient(to right, #f59e0b, rgba(245,158,11,0.3))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
