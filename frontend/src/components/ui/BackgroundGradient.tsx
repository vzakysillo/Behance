interface BackgroundGradientProps {
  className?: string;
}

export function BackgroundGradient({ className = "" }: BackgroundGradientProps) {
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none h-full w-full ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g filter="url(#filter0_f_1765_12597)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M237.676 -567.644C26.5981 -549.3 -56.8149 106.096 -162.724 299.988C-268.249 493.175 -427.41 682.106 -389.252 916.789C-351.518 1148.86 -161.584 1336.28 26.1027 1461.33C180.083 1563.92 359.694 1501.25 532.453 1530.89C671.196 1554.69 804.492 1649.76 937.194 1617.65C1078.7 1583.42 2037.48 1501.58 2106.42 1364.28C2174.11 1229.45 1878.81 -323.08 1863.6 -483.808C1848.33 -645.07 1280.39 353.077 1181.51 224.844C1082.89 96.9555 946.889 24.6985 816.593 -60.1524C616.565 -190.414 458.103 -586.802 237.676 -567.644Z"
          fill="#F7165A"
        />
      </g>
      <g filter="url(#filter1_f_1765_12597)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1099.5 1617.02C1214.4 1739.06 1366.76 1847.63 1563.91 1828.44C1765.01 1808.85 1675.84 1804.32 1850.85 1659.58C1971.08 1560.16 2039.05 1005.72 2155.66 901.991C2344.97 733.595 2427.27 325.12 2483.05 104.808C2536.03 -104.455 2258.7 -562.771 2106.7 -665.63C1978.35 -752.486 1838.9 -767.523 1678.96 -807.24C1479.8 -856.691 2151.77 -325.241 1948.94 -175.226C1735.94 450.775 1743.44 621.765 1493.94 826.767C1219.94 998.269 587.941 1038.28 -139.557 1117.27C-196.246 1316.79 981.194 1491.38 1099.5 1617.02Z"
          fill="#E3D9FC"
        />
      </g>
      <g filter="url(#filter2_f_1765_12597)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1512.94 577.773C1707.72 469.734 1794.53 200.907 2006.31 54.5369C2209.13 -85.6426 2078.07 -80.0368 2091.44 -126.726C2099.12 -153.539 2147.36 -112.141 2006.31 -264.224C1888.38 -391.377 1859.53 -164.094 1651.94 -218.224C1450.04 -270.868 1230.26 -205.512 1006.44 -186.729C761.941 -166.211 708.941 -250.224 438.441 -300.724C177.441 -300.724 -164.472 -315.508 -194.56 -140.727C-105.564 7.27509 169.741 108.11 269.939 264.273C380.939 437.273 294.438 430.278 438.444 616.273C573.529 790.747 1318.17 685.813 1512.94 577.773Z"
          fill="#6146EA"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1765_12597"
          x={-595.035}
          y={-768.316}
          width={2911.52}
          height={2592.52}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={100} result="effect1_foregroundBlur_1765_12597" />
        </filter>
        <filter
          id="filter1_f_1765_12597"
          x={-341.539}
          y={-1010.47}
          width={3031.22}
          height={3041.12}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={100} result="effect1_foregroundBlur_1765_12597" />
        </filter>
        <filter
          id="filter2_f_1765_12597"
          x={-394.559}
          y={-503.465}
          width={2715.43}
          height={1412.78}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={100} result="effect1_foregroundBlur_1765_12597" />
        </filter>
      </defs>
    </svg>
  );
}
