interface StarRatingProps {
  rate: number;
  size?: number;
}

function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}
function Star({
  fill,
  size,
  id,
}: {
  fill: "full" | "half" | "empty";
  size: number;
  id: string;
}) {
  const starPath =
    "M12 2l2.9 6.26L22 9.27l-5 5.14 1.18 7.25L12 18.4l-6.18 3.26L7 14.41 2 9.27l7.1-1.01L12 2z";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {fill === "half" && (
        <defs>
          {/* clipPath обрізає зірку рівно по середині */}
          <clipPath id={`half-${id}`}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
      )}

      {/* Порожній контур — завжди є */}
      <path
        d={starPath}
        stroke="#1a1a1a"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Заливка — повна або ліва половина */}
      {fill !== "empty" && (
        <path
          d={starPath}
          fill="#1a1a1a"
          clipPath={fill === "half" ? `url(#half-${id})` : undefined}
        />
      )}
    </svg>
  );
}

export default function StarRating({ rate, size = 24 }: StarRatingProps) {
  const rounded = roundToHalf(rate);
  const TOTAL = 5;

  const stars = Array.from(
    { length: TOTAL },
    (_, i): "full" | "half" | "empty" => {
      if (i < Math.floor(rounded)) return "full";
      if (i === Math.floor(rounded) && rounded % 1 !== 0) return "half";
      return "empty";
    },
  );

  return (
    <div
      style={{ display: "flex", gap: 3 }}
      role="img"
      aria-label={`Рейтинг ${rate} з 5`}
    >
      {stars.map((fill, i) => (
        <Star key={i} fill={fill} size={size} id={`${i}`} />
      ))}
    </div>
  );
}
