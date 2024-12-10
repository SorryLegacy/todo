import React, { ReactNode } from 'react';

interface SplitBackgroundLayoutProps {
  children: ReactNode;
}


const SplitBackgroundLayout: React.FC<SplitBackgroundLayoutProps> = ({ children }) => {
  const hasAcessToken = localStorage.getItem('accessToken') !== null

  return (
    <div className="relative flex h-screen overflow-y-auto">
      <div className="w-1/2 bg-white"></div>
      <div className="w-1/2 bg-purple-100"></div>
      <div className={`absolute inset-0 flex ${ hasAcessToken ? '' : 'items-center'} justify-center overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
};

export default SplitBackgroundLayout;
