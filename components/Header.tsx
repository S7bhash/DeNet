import React from 'react';

interface HeaderProps {
  groupName: string;
  memberCount: number;
  activeView: 'chat' | 'media';
  onViewChange: (view: 'chat' | 'media') => void;
  onBack: () => void;
}

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-lime-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a3 3 0 00-3 3v1H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a3 3 0 00-3-3zm-1 5v1h2V7a1 1 0 00-2 0z" clipRule="evenodd" />
    </svg>
);

const ViewToggleButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            isActive
                ? 'bg-lime-400/10 text-lime-300'
                : 'text-zinc-400 hover:bg-zinc-700/50'
        }`}
    >
        {label}
    </button>
);


const Header: React.FC<HeaderProps> = ({ groupName, memberCount, activeView, onViewChange, onBack }) => {
  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-800 bg-zinc-900/70 shadow-md backdrop-blur-sm z-10">
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="p-2 text-zinc-400 hover:text-white rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <div>
            <h2 className="text-lg font-bold text-white">{groupName}</h2>
            <p className="text-xs text-zinc-400">{memberCount} nodes connected</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-zinc-800 p-1 rounded-lg">
          <ViewToggleButton label="Chat" isActive={activeView === 'chat'} onClick={() => onViewChange('chat')} />
          <ViewToggleButton label="Media" isActive={activeView === 'media'} onClick={() => onViewChange('media')} />
      </div>

      <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-lime-500/10 rounded-full text-sm text-lime-400 border border-lime-500/20">
        <LockIcon />
        <span>Encrypted</span>
      </div>
    </header>
  );
};

export default Header;