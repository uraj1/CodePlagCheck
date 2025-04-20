import { ReactNode, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActivityType } from '../../types';

interface InputMonitorProps {
  children: ReactNode;
  onActivity: (activity: ActivityType) => void;
}

const InputMonitor = ({ children, onActivity }: InputMonitorProps) => {
  const sessionId = useRef<string>(localStorage.getItem('sessionId') || uuidv4());
  const lastActivity = useRef<number>(Date.now());
  const typingBuffer = useRef<string[]>([]);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Save session ID to localStorage
    localStorage.setItem('sessionId', sessionId.current);
    
    // Event listener for copy
    const handleCopy = () => {
      onActivity({
        sessionId: sessionId.current,
        timestamp: Date.now(),
        type: 'copy',
        data: document.getSelection()?.toString() || ''
      });
    };
    
    // Event listener for paste
    const handlePaste = (e: ClipboardEvent) => {
      onActivity({
        sessionId: sessionId.current,
        timestamp: Date.now(),
        type: 'paste',
        data: e.clipboardData?.getData('text') || ''
      });
    };
    
    // Event listener for tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const timeAway = now - lastActivity.current;
        
        if (timeAway > 1000) { // Only log if gone for more than 1 second
          onActivity({
            sessionId: sessionId.current,
            timestamp: now,
            type: 'tabReturn',
            data: `Away for ${(timeAway / 1000).toFixed(1)}s`
          });
        }
      } else {
        lastActivity.current = Date.now();
        onActivity({
          sessionId: sessionId.current,
          timestamp: lastActivity.current,
          type: 'tabLeave',
          data: ''
        });
      }
    };
    
    // Key press for typing pattern analysis
    const handleKeyPress = (e: KeyboardEvent) => {
      // Collect typing data in buffer
      typingBuffer.current.push(e.key);
      
      // Reset typing timer
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
      
      // After 1 second of no typing, log the buffer
      typingTimer.current = setTimeout(() => {
        if (typingBuffer.current.length > 0) {
          onActivity({
            sessionId: sessionId.current,
            timestamp: Date.now(),
            type: 'typing',
            data: typingBuffer.current.join('')
          });
          
          // Clear buffer after logging
          typingBuffer.current = [];
        }
      }, 1000);
    };
    
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keypress', handleKeyPress);
    
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keypress', handleKeyPress);
      
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
    };
  }, [onActivity]);
  
  return <>{children}</>;
};

export default InputMonitor;