interface Props {
  count?: number;
  className?: string;
}

export default function SkeletonCard({ count = 3, className = '' }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-c-30 p-8 rounded-card border-l-4 border-c-30 relative overflow-hidden ${className}`}
        >
          {/* Position */}
          <div className="h-10 w-16 bg-c-60/60 rounded mb-4 animate-shimmer" />
          {/* Name */}
          <div className="h-6 w-3/4 bg-c-60/60 rounded mb-2 animate-shimmer" />
          {/* Team */}
          <div className="h-4 w-1/2 bg-c-60/60 rounded mb-6 animate-shimmer" />
          {/* Points */}
          <div className="flex justify-between items-end">
            <div className="h-5 w-20 bg-c-60/60 rounded animate-shimmer" />
            <div className="h-8 w-8 bg-c-60/60 rounded-full animate-shimmer" />
          </div>
          {/* Accent bar */}
          <div className="mt-4 h-0.5 w-10 bg-c-60/60 rounded animate-shimmer" />
        </div>
      ))}
    </>
  );
}
