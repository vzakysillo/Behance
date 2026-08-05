interface AuthGradientProps {
  className?: string;
}

export function AuthGradient({ className = "" }: AuthGradientProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        width={955}
        height={1080}
        viewBox="0 0 955 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <g filter="url(#filter0_f_1630_12069)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-123.531 937.406C-233.791 900.706 -194.72 540.451 -226.494 423.516C-258.153 307.006 -318.967 185.928 -268.688 65.6022C-218.968 -53.3849 -93.7508 -129.146 22.3146 -171.922C117.536 -207.015 205.357 -150.68 301.294 -144.464C378.342 -139.472 461.569 -173.187 528.265 -139.14C599.386 -102.833 654.829 -36.1866 674.095 45.8469C693.015 126.405 783.11 1016.2 754.501 1100C725.796 1184.08 550.1 579.204 481 635.001C412.086 690.648 330.324 711.852 249.999 740.502C126.685 784.484 -8.38798 975.731 -123.531 937.406Z"
            fill="#F7165A"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1630_12069"
            x={-487.883}
            y={-383.352}
            width={1447.95}
            height={1691.38}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation={100} result="effect1_foregroundBlur_1630_12069" />
          </filter>
        </defs>
      </svg>
      <svg
        width={721}
        height={1080}
        viewBox="0 0 721 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <g filter="url(#filter0_f_1630_12070)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M380.359 -118.1C457.216 -168.55 552.333 -207.039 655.055 -171.66C759.833 -135.573 711.687 -144.524 786.594 -44.9993C838.048 23.3664 803.613 327.795 852.594 398.001C932.107 511.969 923.93 740.364 925.594 865.001C927.174 983.387 720.793 1192.51 626.594 1228C547.05 1257.97 470.745 1248.21 380.358 1249C267.816 1249.99 771.163 830.387 682.091 724.5C585.172 609.284 496.592 552 380.357 451C339.165 327.782 205.267 247.924 200.156 126.937C195.356 13.2771 301.23 -66.1595 380.359 -118.1Z"
            fill="#E3D9FC"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1630_12070"
            x={0}
            y={-385.381}
            width={1125.6}
            height={1835.29}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation={100} result="effect1_foregroundBlur_1630_12070" />
          </filter>
        </defs>
      </svg>
      <svg
        width={955}
        height={817}
        viewBox="0 0 955 817"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <g filter="url(#filter0_f_1630_12071)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M619.635 304.158C757.62 377.896 793.792 509.377 888.101 614.461C978.421 715.101 1155.11 799.135 1159.84 906.083C1164.59 1013.22 1004.74 1048.3 910.109 1111.44C830.987 1164.24 770.942 1241.66 653.3 1244.06C538.888 1246.4 430.194 1162.21 313.193 1123.65C185.382 1081.53 37.0944 1087.57 -62.8192 1008.06C-166.916 925.229 -210.15 809.238 -203.914 712.166C-197.996 620.042 -82.4715 578.166 -30.3565 502.729C35.1635 407.889 6.25602 255.401 139.829 214.595C275.19 173.243 471.51 225.002 619.635 304.158Z"
            fill="#6146EA"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_1630_12071"
            x={-404.5}
            y={0}
            width={1764.45}
            height={1444.11}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation={100} result="effect1_foregroundBlur_1630_12071" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
