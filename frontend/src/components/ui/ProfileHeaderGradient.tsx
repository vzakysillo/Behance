interface ProfileHeaderGradientProps {
  className?: string;
}

export function ProfileHeaderGradient({ className = "" }: ProfileHeaderGradientProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden bg-brand-100 ${className}`}
      aria-hidden="true"
    >
      <svg
        width={1372}
        height={300}
        viewBox="0 0 1372 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <g filter="url(#filter0_f_1559_11818)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1185.81 480.331C997.759 477.753 844.58 449.374 696.273 418.049C519.797 380.774 240.507 348.914 266.357 286.127C292.507 222.614 640.846 220.997 797.04 173.298C960.507 123.378 941.021 24.7324 1173.76 9.02047C1406.56 -6.69541 1621.63 53.7586 1747.6 109.127C1852.49 155.23 1761.91 213.62 1765.48 269.096C1769.12 325.77 1893.74 387.062 1768.38 432.743C1639.16 479.832 1393.59 483.179 1185.81 480.331Z"
            fill="#6146EA"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1559_11818"
            x={6.57968}
            y={-251.609}
            width={2075.68}
            height={990.778}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation={129.05} result="effect1_foregroundBlur_1559_11818" />
          </filter>
        </defs>
      </svg>
      <svg
        width={1116}
        height={300}
        viewBox="0 0 1116 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <g filter="url(#filter0_f_1559_11819)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M159.127 -294.102C296.467 -260.335 396.006 -207.871 490.573 -153.42C603.101 -88.6281 793.922 -11.8552 745.407 43.4703C696.331 99.4353 438.924 42.9556 301.458 62.2431C157.59 82.4288 125.648 179.361 -53.2031 155.521C-232.099 131.675 -362.184 38.4408 -429.011 -35.1244C-484.655 -96.3796 -390.513 -136.748 -367.101 -190.028C-343.183 -244.46 -406.235 -323.426 -292.436 -345.932C-175.126 -369.133 7.37543 -331.412 159.127 -294.102Z"
            fill="#F7165A"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1559_11819"
            x={-704.436}
            y={-611.158}
            width={1715.68}
            height={1028.53}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation={129.05} result="effect1_foregroundBlur_1559_11819" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
