import * as React from 'react';

// The per-type empty-state artwork, one silhouette per chart type.
//
// Geometry is exported straight from the Figma empty-state instances rather than
// redrawn, so a curve here is the curve the design draws: ChartArea `9893:4515`,
// ChartBar `9893:18409`, ChartDonut `9893:4096`, ChartFunnel `9893:18629`,
// ChartLine `9893:19484`, ChartRadar `9893:20006`, ChartScatter `9899:21900`,
// ChartTreeMap `9899:21844`, CardWidgetTable `9899:21446`, CardWidgetText
// `9899:21112`.
//
// Every fill is `currentColor`, so the tone is set once by the container (see
// `chart-state.tsx`) and follows brand and theme overrides. Figma binds the
// artwork to `components/Avatar/color/blue` — almost certainly an incidental
// swatch pick, and the wrong tier for a chart to reference — so `ChartState`
// points at a semantic token with the identical light/dark pair instead.
//
// Where the design used two tones (the table and metric-list silhouettes tint a
// header row darker than the body rows) that hierarchy is kept as `fill-opacity`
// on one colour. Those two are also the only ones whose Figma fills are raw
// hexes rather than bound variables — worth fixing upstream, but normalising
// here means the drift doesn't reach the kit.

/** Shared props: these are decorative, so they are hidden from AT. */
const svg = {
  'aria-hidden': true,
  focusable: 'false',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
} as const;

/** Data rows (table) and label bars (text) — secondary tier on a light semantic token. */
const SECONDARY = 0.45;

function AreaIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 148 92" className={className}>
      <ellipse cx="9.2" cy="82.8" rx="6.9" ry="6.9" fill="currentColor" />
      <ellipse cx="138" cy="6.9" rx="6.9" ry="6.9" fill="currentColor" />
      <path
        d="M129.213 14.3192C127.879 17.2623 126.533 19.7915 125.134 21.8601C122.178 26.2285 119.652 27.6 117.3 27.6C115.694 27.6 114.26 27.033 112.65 25.842C111.124 24.7134 109.732 23.2628 108.01 21.4678C107.761 21.2089 107.506 20.9428 107.242 20.6695C103.458 16.7444 97.8376 11.095 88.8771 12.7242C84.1866 13.577 81.1305 17.5699 79.1076 20.8784C77.2754 23.8749 75.5684 27.5813 73.9527 31.0895C73.6606 31.7238 73.3714 32.3516 73.0851 32.9676C71.1236 37.1868 69.2308 41.0019 67.1009 43.8886C64.9517 46.8014 63.0642 48.0758 61.3437 48.3626C60.6908 48.4714 59.63 48.3451 57.8004 47.5114C56.2701 46.8142 54.6945 45.8665 52.7976 44.7255C52.4004 44.4866 51.9885 44.2388 51.5606 43.9835C47.1588 41.357 40.7043 37.609 33.5021 39.2095C29.6669 40.0618 26.2489 42.5651 23.3795 45.4942C20.447 48.4879 17.712 52.3115 15.2865 56.4804C12.6456 61.0194 10.2783 66.1297 8.37485 71.3202C8.64738 71.3009 8.92255 71.2911 9.2 71.2911C12.2343 71.2911 14.9943 72.4653 17.0504 74.3842C18.7583 69.7445 20.8805 65.1598 23.2385 61.107C25.413 57.3696 27.7092 54.2213 29.9516 51.9322C32.2573 49.5786 34.1581 48.4882 35.4978 48.1904C38.6456 47.4909 42.0209 49.0047 46.8465 51.884C47.1889 52.0883 47.5417 52.301 47.9028 52.5187L47.911 52.5236C49.8061 53.6662 51.9293 54.9463 53.9857 55.8833C56.4583 57.0099 59.5389 57.9903 62.8562 57.4374C68.0357 56.5741 71.7754 53.0487 74.5038 49.3508C77.2516 45.6268 79.487 41.0203 81.4276 36.846C81.7469 36.1591 82.0577 35.4854 82.3618 34.8262L82.365 34.8193C83.9947 31.2867 85.4321 28.1709 86.9567 25.6775C89.0266 22.2921 90.6144 21.881 91.9651 21.881C94.9987 21.881 96.6424 22.9306 100.62 27.0555C100.847 27.2912 101.082 27.5365 101.323 27.789L101.325 27.7908C102.985 29.5276 104.972 31.6062 107.18 33.2392C109.846 35.2107 113.156 36.8 117.3 36.8C124.148 36.8 129.096 32.4215 132.754 27.0149C134.443 24.5177 135.999 21.5999 137.469 18.388C134.16 18.2375 131.216 16.689 129.213 14.3192Z"
        fill="currentColor"
      />
      <path
        d="M20.1556 79.2645C20.5148 80.3785 20.7088 81.5666 20.7088 82.8C20.7088 84.4354 20.7 86.25 20.7088 87.4H32.1999V56.2775C30.5957 58.1198 28.8957 60.5306 27.2144 63.4203C25.004 67.2194 22.9923 71.5585 21.3672 75.9732L20.1556 79.2645Z"
        fill="currentColor"
      />
      <path
        d="M119.6 41.2712V87.4H142.6V20.5084C142.6 19.975 141.874 19.8168 141.652 20.3018C140.116 23.6578 138.441 26.818 136.564 29.5923C132.91 34.9934 127.457 40.3789 119.6 41.2712Z"
        fill="currentColor"
      />
      <path
        d="M91.9999 26.5657V87.4H115V41.271C110.666 40.7799 107.17 38.9529 104.445 36.9377C101.917 35.0683 99.7023 32.7512 98.0937 31.0679L97.9976 30.9673C97.7551 30.7136 97.5273 30.4754 97.3086 30.2486C95.3135 28.1795 94.2762 27.2916 93.5591 26.8582C93.1359 26.6025 92.8325 26.4923 92.0883 26.4818C92.0629 26.5047 92.0334 26.5324 91.9999 26.5657Z"
        fill="currentColor"
      />
      <path
        d="M64.3999 61.8266V87.4H87.3999V34.8918C87.1234 35.4863 86.8382 36.1041 86.5419 36.7463L86.5388 36.7531C86.235 37.4115 85.9214 38.0912 85.5988 38.7852C83.6676 42.9392 81.2614 47.94 78.2053 52.082C75.3059 56.0115 70.8807 60.4657 64.3999 61.8266Z"
        fill="currentColor"
      />
      <path
        d="M36.7999 52.6333V87.4H59.7999V62.1598C56.7424 61.9605 54.0785 60.9806 52.0784 60.0693C49.7792 59.0216 47.4671 57.6275 45.635 56.5228L45.5277 56.4581C45.1649 56.2394 44.8213 56.0323 44.4894 55.8342C42.1184 54.4195 40.3949 53.522 39.0092 53.0319C37.9439 52.6552 37.2695 52.5893 36.7999 52.6333Z"
        fill="currentColor"
      />
    </svg>
  );
}

// The line silhouette is the area one without its filled columns — the same
// curve, so the two read as siblings the way the mockups do.
function LineIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 148 92" className={className}>
      <ellipse cx="9.2" cy="82.8" rx="6.9" ry="6.9" fill="currentColor" />
      <ellipse cx="138" cy="6.9" rx="6.9" ry="6.9" fill="currentColor" />
      <path
        d="M129.213 14.3192C127.879 17.2623 126.533 19.7915 125.134 21.8601C122.178 26.2285 119.652 27.6 117.3 27.6C115.694 27.6 114.26 27.033 112.65 25.842C111.124 24.7134 109.732 23.2628 108.01 21.4678C107.761 21.2089 107.506 20.9428 107.242 20.6695C103.458 16.7444 97.8376 11.095 88.8771 12.7242C84.1866 13.577 81.1305 17.5699 79.1076 20.8784C77.2754 23.8749 75.5684 27.5813 73.9527 31.0895C73.6606 31.7238 73.3714 32.3516 73.0851 32.9676C71.1236 37.1868 69.2308 41.0019 67.1009 43.8886C64.9517 46.8014 63.0642 48.0758 61.3437 48.3626C60.6908 48.4714 59.63 48.3451 57.8004 47.5114C56.2701 46.8142 54.6945 45.8665 52.7976 44.7255C52.4004 44.4866 51.9885 44.2388 51.5606 43.9835C47.1588 41.357 40.7043 37.609 33.5021 39.2095C29.6669 40.0618 26.2489 42.5651 23.3795 45.4942C20.447 48.4879 17.712 52.3115 15.2865 56.4804C12.6456 61.0194 10.2783 66.1297 8.37485 71.3202C8.64738 71.3009 8.92255 71.2911 9.2 71.2911C12.2343 71.2911 14.9943 72.4653 17.0504 74.3842C18.7583 69.7445 20.8805 65.1598 23.2385 61.107C25.413 57.3696 27.7092 54.2213 29.9516 51.9322C32.2573 49.5786 34.1581 48.4882 35.4978 48.1904C38.6456 47.4909 42.0209 49.0047 46.8465 51.884C47.1889 52.0883 47.5417 52.301 47.9028 52.5187L47.911 52.5236C49.8061 53.6662 51.9293 54.9463 53.9857 55.8833C56.4583 57.0099 59.5389 57.9903 62.8562 57.4374C68.0357 56.5741 71.7754 53.0487 74.5038 49.3508C77.2516 45.6268 79.487 41.0203 81.4276 36.846C81.7469 36.1591 82.0577 35.4854 82.3618 34.8262L82.365 34.8193C83.9947 31.2867 85.4321 28.1709 86.9567 25.6775C89.0266 22.2921 90.6144 21.881 91.9651 21.881C94.9987 21.881 96.6424 22.9306 100.62 27.0555C100.847 27.2912 101.082 27.5365 101.323 27.789L101.325 27.7908C102.985 29.5276 104.972 31.6062 107.18 33.2392C109.846 35.2107 113.156 36.8 117.3 36.8C124.148 36.8 129.096 32.4215 132.754 27.0149C134.443 24.5177 135.999 21.5999 137.469 18.388C134.16 18.2375 131.216 16.689 129.213 14.3192Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Bar: the design draws the *horizontal* silhouette (a dot and a rounded row per
// category), which is what both bar shapes fall back to when there's no data.
function BarIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 148 92" className={className}>
      {[13.8, 46, 78.2].map((cy) => (
        <React.Fragment key={cy}>
          <ellipse cx="16.1" cy={cy} rx="9.2" ry="9.2" fill="currentColor" />
          <rect
            x="32.2"
            y={cy - 6.9}
            width="105.8"
            height="13.8"
            rx="6.9"
            fill="currentColor"
          />
        </React.Fragment>
      ))}
    </svg>
  );
}

function DonutIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 148 92" className={className}>
      {[25.179, 48.179, 71.179].map((cy) => (
        <React.Fragment key={cy}>
          <ellipse
            cx="105.679"
            cy={cy}
            rx="6.9"
            ry="6.9"
            fill="currentColor"
          />
          <rect
            x="117.179"
            y={cy - 4.6}
            width="27.6"
            height="9.2"
            rx="4.6"
            fill="currentColor"
          />
        </React.Fragment>
      ))}
      <path
        d="M2.23955 48.179C2.50058 53.1318 3.60319 58.0098 5.50544 62.6023C5.73927 63.1668 5.9847 63.7258 6.2415 64.279C8.39654 68.9214 11.3526 73.1537 14.9784 76.7796C18.6043 80.4054 22.8365 83.3614 27.479 85.5165C28.0322 85.7733 28.5912 86.0187 29.1557 86.2525C33.7482 88.1548 38.6262 89.2574 43.579 89.5184V75.6918C28.8994 74.5752 17.1828 62.8585 16.0661 48.179H2.23955Z"
        fill="currentColor"
      />
      <path
        d="M27.479 6.24149C32.5057 3.90815 37.9667 2.53507 43.579 2.2395V16.0661C28.8995 17.1828 17.1828 28.8995 16.0661 43.579H2.2395C2.53507 37.9667 3.90815 32.5057 6.2415 27.479C8.37842 22.8754 11.3207 18.6361 14.9784 14.9784C18.6361 11.3207 22.8754 8.37842 27.479 6.24149Z"
        fill="currentColor"
      />
      <path
        d="M48.179 16.0661C63.6176 17.2406 75.779 30.1396 75.779 45.879C75.779 61.6184 63.6176 74.5174 48.179 75.6918V89.5184C53.1317 89.2574 58.0098 88.1548 62.6022 86.2525C63.1668 86.0187 63.7258 85.7733 64.279 85.5165C68.9214 83.3614 73.1537 80.4054 76.7795 76.7796C80.8375 72.7216 84.0564 67.9042 86.2525 62.6023C88.4486 57.3003 89.579 51.6178 89.579 45.879C89.579 40.1402 88.4487 34.4577 86.2525 29.1557C84.0564 23.8538 80.8375 19.0364 76.7796 14.9784C73.1537 11.3526 68.9214 8.39656 64.279 6.24151C63.7258 5.98472 63.1668 5.73929 62.6023 5.50546C58.0098 3.60321 53.1318 2.50059 48.179 2.23956V16.0661Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FunnelIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 256 120" className={className}>
      <path
        d="M97.8281 29.4253L75.4796 7.42528C74.2044 6.16997 75.0932 4 76.8826 4H179.051C180.85 4 181.734 6.18882 180.441 7.43841L157.668 29.4384C157.295 29.7987 156.797 30 156.278 30H99.2312C98.7062 30 98.2022 29.7936 97.8281 29.4253Z"
        fill="currentColor"
      />
      <path
        d="M152.797 34H102.222C100.738 34 99.7713 35.558 100.429 36.8873L111.32 58.8873C111.658 59.5688 112.352 60 113.113 60H142.047C142.812 60 143.509 59.5646 143.844 58.878L154.594 36.878C155.243 35.5494 154.276 34 152.797 34Z"
        fill="currentColor"
      />
      <path
        d="M140.242 64H114.775C113.41 64 112.446 65.3374 112.878 66.6325L120.211 88.6325C120.483 89.4491 121.247 90 122.108 90H133.05C133.915 90 134.682 89.4438 134.951 88.6215L142.143 66.6215C142.566 65.3286 141.602 64 140.242 64Z"
        fill="currentColor"
      />
      <path
        d="M132.415 94H123.539C122.245 94 121.291 95.2101 121.594 96.4681L125.868 114.222C126.355 116.246 129.226 116.271 129.749 114.255L134.351 96.5019C134.68 95.2355 133.724 94 132.415 94Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RadarIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 116 121" className={className}>
      <path
        d="M66.3037 0C65.0751 0 63.8968 0.491806 63.028 1.36722C62.1592 2.24264 61.6711 3.42996 61.6711 4.66798C61.6711 5.90601 62.1592 7.09333 63.028 7.96875C63.8968 8.84416 65.0751 9.33597 66.3037 9.33597C67.5323 9.33597 68.7107 8.84416 69.5794 7.96875C70.4482 7.09333 70.9363 5.90601 70.9363 4.66798C70.9363 3.42996 70.4482 2.24264 69.5794 1.36722C68.7107 0.491806 67.5323 0 66.3037 0ZM57.0928 5.6344L8.37844 41.3007C9.86724 41.9643 11.1562 43.0115 12.1156 44.3367C13.075 45.662 13.671 47.2186 13.8434 48.8497L62.5578 13.1834C61.069 12.5198 59.78 11.4727 58.8206 10.1474C57.8612 8.82215 57.2653 7.26557 57.0928 5.6344ZM75.0621 7.67664C74.5389 9.23233 73.6175 10.6214 72.3911 11.7035C71.1646 12.7856 69.6766 13.5225 68.0771 13.8398L101.609 52.5878C102.133 51.0378 103.053 49.6541 104.276 48.5755C105.499 47.4969 106.982 46.7614 108.576 46.4428L75.0621 7.67664ZM64.8922 17.2497L61.6711 19.6019V63.583L20.1408 49.9985L16.9197 52.3507L21.6609 60.3191L58.7939 72.4814L42.3989 95.2013L44.7152 99.0853L50.5421 99.8146L66.3037 77.9699L85.214 104.191L91.5114 104.993L92.7057 98.6841L73.8135 72.4814L99.2927 64.1301H99.3108L100.415 58.2951L97.4831 54.9035L70.9363 63.583V24.2334L64.8922 17.2497ZM4.63257 45.1482C3.40394 45.1482 2.22563 45.64 1.35685 46.5154C0.488074 47.3908 0 48.5781 0 49.8161C0 51.0542 0.488074 52.2415 1.35685 53.1169C2.22563 53.9923 3.40394 54.4841 4.63257 54.4841C5.86121 54.4841 7.03952 53.9923 7.90829 53.1169C8.77707 52.2415 9.26514 51.0542 9.26514 49.8161C9.26514 48.5781 8.77707 47.3908 7.90829 46.5154C7.03952 45.64 5.86121 45.1482 4.63257 45.1482ZM110.367 50.9284C109.139 50.9284 107.96 51.4202 107.092 52.2956C106.223 53.1711 105.735 54.3584 105.735 55.5964C105.735 56.8344 106.223 58.0218 107.092 58.8972C107.96 59.7726 109.139 60.2644 110.367 60.2644C111.596 60.2644 112.774 59.7726 113.643 58.8972C114.512 58.0218 115 56.8344 115 55.5964C115 54.3584 114.512 53.1711 113.643 52.2956C112.774 51.4202 111.596 50.9284 110.367 50.9284ZM12.7034 54.3565C11.9131 55.7878 10.763 56.9844 9.36857 57.8261C7.97416 58.6679 6.38452 59.1252 4.75924 59.1521L30.9803 103.261C31.7683 101.826 32.9174 100.626 34.312 99.7809C35.7065 98.9358 37.2974 98.4758 38.9245 98.4471L12.7034 54.3565ZM104.305 62.6349L95.9268 106.525C96.9095 106.177 97.9434 105.998 98.9851 105.996C101.212 105.997 103.364 106.806 105.047 108.275L113.389 64.4036C112.418 64.7478 111.397 64.9265 110.367 64.9324C108.138 64.9263 105.986 64.1106 104.305 62.6349ZM39.0692 103.115C37.8406 103.115 36.6623 103.607 35.7935 104.482C34.9247 105.358 34.4367 106.545 34.4367 107.783C34.4367 109.021 34.9247 110.208 35.7935 111.084C36.6623 111.959 37.8406 112.451 39.0692 112.451C40.2979 112.451 41.4762 111.959 42.345 111.084C43.2137 110.208 43.7018 109.021 43.7018 107.783C43.7018 106.545 43.2137 105.358 42.345 104.482C41.4762 103.607 40.2979 103.115 39.0692 103.115ZM47.6105 104.154C48.0897 105.303 48.3358 106.537 48.3344 107.783C48.3331 109.818 47.6723 111.796 46.4524 113.417L90.4437 118.961C89.9646 117.812 89.7184 116.578 89.7199 115.332C89.7212 113.297 90.382 111.319 91.6019 109.698L47.6105 104.154ZM98.9851 110.664C97.7564 110.664 96.5781 111.156 95.7093 112.031C94.8406 112.907 94.3525 114.094 94.3525 115.332C94.3525 116.57 94.8406 117.757 95.7093 118.633C96.5781 119.508 97.7564 120 98.9851 120C100.214 120 101.392 119.508 102.261 118.633C103.13 117.757 103.618 116.57 103.618 115.332C103.618 114.094 103.13 112.907 102.261 112.031C101.392 111.156 100.214 110.664 98.9851 110.664Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ScatterIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 96 92" className={className}>
      <path
        d="M90.1 81.9571L18.1429 81.9571C10.8843 81.9571 5 76.0729 5 68.8143L5 10"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {[
        [53.5, 63.5],
        [33.5, 43.5],
        [60.5, 30.5],
        [33.5, 13.5],
        [73.5, 49.5],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="6.5"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function TreemapIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 148 92" className={className}>
      <path
        d="M4.60001 9.20001C4.60001 6.6595 6.6595 4.60001 9.20001 4.60001H73.6V87.4H9.20001C6.6595 87.4 4.60001 85.3405 4.60001 82.8V9.20001Z"
        fill="currentColor"
      />
      <path
        d="M78.2 50.6H142.6V82.8C142.6 85.3405 140.541 87.4 138 87.4H78.2V50.6Z"
        fill="currentColor"
      />
      <rect x="78.2" y="4.6" width="29.9" height="41.4" fill="currentColor" />
      <path
        d="M112.7 4.60001H138C140.541 4.60001 142.6 6.6595 142.6 9.20001V46H112.7V4.60001Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Figma node 9899:21554 (Group 31 inside CardWidgetTable's monochrome thumbnail).
// Container: 64×40. 3 columns — narrow left (w=9), medium centre (w=24), medium
// right (w=23) — with 2 px gaps between columns and a 4 px left margin. 4 rows
// (header + 3 data) each 8 px tall with 2 px gaps. Only the 4 outer table corners
// are rounded (r=2); inner corners are square. Paths are translated from Figma
// local coords by the group offset (2, 1) to viewBox coords (0 0 64 40).
function TableIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 64 40" className={className}>
      {/* Header row — full opacity so it reads as the header */}
      <path d="M 6 2 L 13 2 L 13 10 L 4 10 L 4 4 C 4 2.9 4.9 2 6 2 Z" fill="currentColor" />
      <rect x={15} y={2} width={24} height={8} fill="currentColor" />
      <path d="M 41 2 L 62 2 C 63.1 2 64 2.9 64 4 L 64 10 L 41 10 Z" fill="currentColor" />
      {/* Middle data rows — no corner rounding needed */}
      {[12, 22].map((y) => (
        <React.Fragment key={y}>
          <rect x={4} y={y} width={9} height={8} fill="currentColor" fillOpacity={SECONDARY} />
          <rect x={15} y={y} width={24} height={8} fill="currentColor" fillOpacity={SECONDARY} />
          <rect x={41} y={y} width={23} height={8} fill="currentColor" fillOpacity={SECONDARY} />
        </React.Fragment>
      ))}
      {/* Last data row — outer bottom corners rounded */}
      <path
        d="M 4 32 L 13 32 L 13 40 L 6 40 C 4.9 40 4 39.1 4 38 Z"
        fill="currentColor"
        fillOpacity={SECONDARY}
      />
      <rect x={15} y={32} width={24} height={8} fill="currentColor" fillOpacity={SECONDARY} />
      <path
        d="M 41 32 L 64 32 L 64 38 C 64 39.1 63.1 40 62 40 L 41 40 Z"
        fill="currentColor"
        fillOpacity={SECONDARY}
      />
    </svg>
  );
}

// No Figma node exists for Sankey — drawn to match the chart's structure: two tall
// source nodes on the left, three shorter destination nodes on the right, and three
// bezier bands of varying widths connecting them. The bands use SECONDARY opacity so
// they read as flow rather than solid blocks.
function SankeyIllustration({ className }: { className?: string }) {
  return (
    <svg {...svg} viewBox="0 0 148 92" className={className}>
      {/* Source nodes */}
      <rect x={4} y={5} width={10} height={36} rx={2} fill="currentColor" />
      <rect x={4} y={51} width={10} height={36} rx={2} fill="currentColor" />
      {/* Destination nodes */}
      <rect x={134} y={5} width={10} height={22} rx={2} fill="currentColor" />
      <rect x={134} y={35} width={10} height={22} rx={2} fill="currentColor" />
      <rect x={134} y={65} width={10} height={22} rx={2} fill="currentColor" />
      {/* Flows: cubic bezier bands with control points at midX=74 */}
      <path d="M 14 5 C 74 5 74 5 134 5 L 134 27 C 74 27 74 27 14 27 Z" fill="currentColor" fillOpacity={SECONDARY} />
      <path d="M 14 27 C 74 27 74 35 134 35 L 134 57 C 74 57 74 41 14 41 Z" fill="currentColor" fillOpacity={SECONDARY} />
      <path d="M 14 51 C 74 51 74 65 134 65 L 134 87 C 74 87 74 87 14 87 Z" fill="currentColor" fillOpacity={SECONDARY} />
    </svg>
  );
}

function TextIllustration({ className }: { className?: string }) {
  const rows = [
    [13.8, 4.6],
    [13.8, 55.2],
    [87.4, 4.6],
    [87.4, 55.2],
  ];

  return (
    <svg {...svg} viewBox="0 0 148 92" className={className}>
      {rows.map(([x, y]) => (
        <React.Fragment key={`${x}-${y}`}>
          <circle cx={x + 9.2} cy={y + 9.2} r="9.2" fill="currentColor" />
          <rect
            x={x}
            y={y + 23}
            width="46"
            height="9.2"
            rx="4.6"
            fill="currentColor"
            fillOpacity={SECONDARY}
          />
        </React.Fragment>
      ))}
    </svg>
  );
}

/** The chart types the design draws an empty state for. */
export type ChartStateVariant =
  | 'area'
  | 'bar'
  | 'line'
  | 'donut'
  | 'radial'
  | 'funnel'
  | 'radar'
  | 'sankey'
  | 'scatter'
  | 'treemap'
  | 'table'
  | 'text';

// `radial` shares the donut silhouette: the design draws one ring for both, and
// a radial-bar widget with no data has nothing to distinguish it by.
export const CHART_STATE_ILLUSTRATIONS: Record<
  ChartStateVariant,
  (props: { className?: string }) => React.ReactElement
> = {
  area: AreaIllustration,
  bar: BarIllustration,
  line: LineIllustration,
  donut: DonutIllustration,
  radial: DonutIllustration,
  funnel: FunnelIllustration,
  radar: RadarIllustration,
  sankey: SankeyIllustration,
  scatter: ScatterIllustration,
  treemap: TreemapIllustration,
  table: TableIllustration,
  text: TextIllustration,
};
