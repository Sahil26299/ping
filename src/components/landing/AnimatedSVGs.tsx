import React from 'react'

export const AnimatedChatBubble: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg 
      className={`${className}`} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
        </linearGradient>
      </defs>
      
      {/* Main chat bubble */}
      <path
        d="M20 40 C20 20, 40 20, 60 20 L140 20 C160 20, 180 40, 180 60 L180 120 C180 140, 160 160, 140 160 L80 160 L40 200 L50 160 L60 160 C40 160, 20 140, 20 120 L20 40 Z"
        fill="url(#chatGradient)"
        className="animate-pulse"
      />
      
      {/* Message dots */}
      <circle cx="60" cy="70" r="4" fill="white" className="animate-bounce" style={{ animationDelay: '0s' }} />
      <circle cx="80" cy="70" r="4" fill="white" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
      <circle cx="100" cy="70" r="4" fill="white" className="animate-bounce" style={{ animationDelay: '0.4s' }} />
      
      {/* Message lines */}
      <rect x="60" y="90" width="80" height="3" rx="1.5" fill="white" className="animate-pulse" />
      <rect x="60" y="100" width="60" height="3" rx="1.5" fill="white" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
      
      {/* Floating elements */}
      <circle cx="30" cy="30" r="2" fill="hsl(var(--accent))" className="animate-ping" />
      <circle cx="170" cy="50" r="1.5" fill="hsl(var(--accent))" className="animate-ping" style={{ animationDelay: '1s' }} />
    </svg>
  )
}

export const AnimatedUsers: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg 
      className={`${className}`} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--secondary) / 0.7)" />
        </linearGradient>
      </defs>
      
      {/* User 1 */}
      <g className="animate-bounce" style={{ animationDelay: '0s' }}>
        <circle cx="50" cy="50" r="20" fill="url(#userGradient)" />
        <circle cx="50" cy="40" r="8" fill="white" />
        <path d="M35 65 C35 55, 42 50, 50 50 C58 50, 65 55, 65 65" fill="white" />
      </g>
      
      {/* User 2 */}
      <g className="animate-bounce" style={{ animationDelay: '0.3s' }}>
        <circle cx="100" cy="50" r="20" fill="url(#userGradient)" />
        <circle cx="100" cy="40" r="8" fill="white" />
        <path d="M85 65 C85 55, 92 50, 100 50 C108 50, 115 55, 115 65" fill="white" />
      </g>
      
      {/* User 3 */}
      <g className="animate-bounce" style={{ animationDelay: '0.6s' }}>
        <circle cx="150" cy="50" r="20" fill="url(#userGradient)" />
        <circle cx="150" cy="40" r="8" fill="white" />
        <path d="M135 65 C135 55, 142 50, 150 50 C158 50, 165 55, 165 65" fill="white" />
      </g>
      
      {/* Connection lines */}
      <path d="M70 50 L80 50" stroke="hsl(var(--accent))" strokeWidth="2" className="animate-pulse" />
      <path d="M120 50 L130 50" stroke="hsl(var(--accent))" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* Online indicators */}
      <circle cx="65" cy="35" r="3" fill="hsl(var(--chart-1))" className="animate-ping" />
      <circle cx="115" cy="35" r="3" fill="hsl(var(--chart-2))" className="animate-ping" style={{ animationDelay: '0.3s' }} />
      <circle cx="165" cy="35" r="3" fill="hsl(var(--chart-3))" className="animate-ping" style={{ animationDelay: '0.6s' }} />
    </svg>
  )
}

export const AnimatedNotification: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg 
      className={`${className}`} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="notificationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--accent) / 0.7)" />
        </linearGradient>
      </defs>
      
      {/* Bell */}
      <path
        d="M100 20 C120 20, 140 40, 140 60 L140 80 C140 100, 150 110, 150 120 L50 120 C50 110, 60 100, 60 80 L60 60 C60 40, 80 20, 100 20 Z"
        fill="url(#notificationGradient)"
        className="animate-pulse"
      />
      
      {/* Bell clapper */}
      <circle cx="100" cy="130" r="8" fill="hsl(var(--primary))" className="animate-bounce" />
      
      {/* Notification badge */}
      <circle cx="140" cy="40" r="12" fill="hsl(var(--destructive))" className="animate-ping" />
      <text x="140" y="45" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">3</text>
      
      {/* Sound waves */}
      <path d="M160 60 Q180 60, 180 80 Q180 100, 160 100" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" className="animate-pulse" />
      <path d="M160 70 Q190 70, 190 80 Q190 90, 160 90" stroke="hsl(var(--accent))" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
    </svg>
  )
}

export const FloatingElements: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-6 h-6 bg-secondary/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-5 h-5 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      
      {/* Floating lines */}
      <div className="absolute top-32 left-1/4 w-20 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse" />
      <div className="absolute bottom-40 right-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  )
}
