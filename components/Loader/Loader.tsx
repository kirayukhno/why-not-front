// 'use client';

// import { RotatingLines } from 'react-loader-spinner';
// import css from './Loader.module.css';

// interface LoaderProps {
//   size?: number;
//   strokeWidth?: number;
//   center?: boolean;
// }

// export default function Loader({
//   size = 64,
//   strokeWidth = 5,
//   center = false,
// }: LoaderProps) {
//   return (
//     <div
//       className={center ? css.center : undefined}
//       role='status'
//       aria-live='polite'
//       aria-busy='true'
//       aria-label='Loading'
//     >
//       <RotatingLines
//         width={size}
//         strokeWidth={strokeWidth}
//         strokeColor='currentColor'
//       />
//     </div>
//   );
// }

"use client";

import { RotatingLines } from "react-loader-spinner";
import css from "./Loader.module.css";

interface LoaderProps {
  size?: number;
  strokeWidth?: number;
  center?: boolean;
}

export default function Loader({
  size = 64,
  strokeWidth = 5,
  center = false,
}: LoaderProps) {
  return (
    <div className={center ? css.center : css.root}>
      <div className={css.spinnerWrap}>
        <RotatingLines
          width={size}
          strokeWidth={strokeWidth}
          strokeColor="currentColor"
          ariaLabel="loading"
        />
      </div>
    </div>
  );
}
