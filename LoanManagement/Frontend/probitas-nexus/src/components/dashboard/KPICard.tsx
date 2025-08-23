import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  navigateTo?: string;
  filter?: string;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-primary",
  trend,
  onClick,
  navigateTo,
  filter
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (navigateTo) {
      navigate(`${navigateTo}${filter ? `?filter=${filter}` : ''}`);
    }
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all duration-200 ${
        (onClick || navigateTo) ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {value}
            </p>
            {trend && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-muted ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;