import React from 'react';
import Lottie from 'lottie-react';
import animationData from './LottieLoader'

interface LottieLoaderProps {
  width?: number;
  height?: number;
  className?: string;
}

const LottieLoader: React.FC<LottieLoaderProps> = ({ width = 280, height = 160, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width, height }}
      />
    </div>
  );
};

export default LottieLoader;