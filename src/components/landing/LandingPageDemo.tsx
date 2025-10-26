import React from 'react'

// Demo component to showcase the landing page
export const LandingPageDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🎉 Landing Page Complete!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your Ping application now has a beautiful landing page with animated SVGs and interactive elements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">✨ Features Implemented</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Animated SVG components (chat bubbles, users, notifications)</li>
              <li>• Interactive hero section with gradient text</li>
              <li>• Features showcase with hover effects</li>
              <li>• Call-to-action sections with login/signup buttons</li>
              <li>• Responsive design for all screen sizes</li>
              <li>• Seamless integration with existing auth flow</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">🎨 Design Elements</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Floating animated elements</li>
              <li>• Gradient backgrounds and text effects</li>
              <li>• Smooth hover transitions</li>
              <li>• Consistent color scheme from globals.css</li>
              <li>• Professional typography and spacing</li>
              <li>• Mobile-first responsive layout</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <span>🚀</span>
            <span className="font-medium">Ready to launch your Ping application!</span>
          </div>
        </div>
      </div>
    </div>
  )
}
