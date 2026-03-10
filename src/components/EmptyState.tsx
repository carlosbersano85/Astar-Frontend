import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
  className?: string;
}

const EmptyState = ({ message = "No hay datos.", icon: Icon = Inbox, className = "" }: EmptyStateProps) => (
  <div className={`flex flex-col items-center justify-center py-12 text-center text-muted-foreground ${className}`}>
    <Icon className="w-12 h-12 mb-3 opacity-50" strokeWidth={1.25} />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;
