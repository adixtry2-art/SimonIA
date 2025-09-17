export default function LoadingDots() {
  return (
    <div className="flex space-x-1" data-testid="loading-dots">
      <div 
        className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
        style={{ animationDelay: '0.2s' }}
      />
      <div 
        className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
}
