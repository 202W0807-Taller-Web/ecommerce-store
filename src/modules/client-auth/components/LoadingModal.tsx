import { useEffect, useRef, useState, useCallback } from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}



export const LoadingModal = ({ 
  isOpen, 
  onClose, // eslint-disable-line @typescript-eslint/no-unused-vars
  anchorEl 
}: LoadingModalProps) => {

  void onClose;
  
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    right: 0,
    width: 320,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const updateHorizontalPosition = useCallback(() => {
    if (!anchorEl) return;
    
    const anchorRect = anchorEl.getBoundingClientRect();
    const menuWidth = Math.min(320, window.innerWidth - 40);
    const triangleOffset = 20;
    
    const menuRight = window.innerWidth - anchorRect.right + 
      (anchorRect.width / 2) - triangleOffset - 25;
    
    setMenuPosition((prev) => ({
      ...prev,
      right: Math.max(10, Math.min(menuRight, window.innerWidth - menuWidth - 10)),
      width: menuWidth,
    }));
  }, [anchorEl]);

  const setInitialPosition = useCallback(() => {
    if (!anchorEl) return;
    
    const anchorRect = anchorEl.getBoundingClientRect();
    const menuWidth = Math.min(320, window.innerWidth - 40);
    const triangleOffset = 20;
    
    const menuRight = window.innerWidth - anchorRect.right + 
      (anchorRect.width / 2) - triangleOffset - 25;
    
    setMenuPosition({
      top: anchorRect.bottom + 8,
      right: Math.max(10, Math.min(menuRight, window.innerWidth - menuWidth - 10)),
      width: menuWidth,
    });
  }, [anchorEl]);

  useEffect(() => {
    if (!isOpen || !anchorEl) return;
    
    setInitialPosition();
    
    const handleResize = () => {
      updateHorizontalPosition();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, anchorEl, setInitialPosition, updateHorizontalPosition]);

  if (!isOpen || !anchorEl) return null;
  
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${menuPosition.top}px`,
    right: `${menuPosition.right}px`,
    width: `${menuPosition.width}px`,
    zIndex: 50,
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  return (
    <div 
      ref={menuRef}
      style={menuStyle}
      className="transition-all duration-200 ease-in-out"
      data-testid="loading-modal"
    >
      <div className="relative p-1">
        <div 
          className="absolute -top-2 right-5 w-4 h-4 bg-white transform rotate-45 
          border-t border-l border-gray-200 z-10"
        />
        <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
          <div className="animate-spin text-blue-500">
            <FiLoader className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            Cargando sesión...
          </span>
        </div>
      </div>
    </div>
  );
};
