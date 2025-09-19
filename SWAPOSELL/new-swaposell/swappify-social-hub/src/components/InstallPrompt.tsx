import React from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Show prompt after 30 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  if (!isInstallable || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-neutral-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-800 mb-1">
            Install SWAPOSELL
          </h3>
          <p className="text-sm text-neutral-600 mb-3">
            Get the full app experience! Install SWAPOSELL for faster access and offline features.
          </p>
          <div className="flex gap-2">
            <button
              onClick={installApp}
              className="btn-brand text-sm px-3 py-1.5"
            >
              Install
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="btn-neutral text-sm px-3 py-1.5"
            >
              Maybe Later
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-shrink-0 p-1 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
