import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  colorClass: string;
}

const FeatureCard = ({ icon: Icon, title, description, link, colorClass }: FeatureCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-500 hover:shadow-lg">
      <div className="p-8 space-y-4">
        <div className={`inline-flex p-3 rounded-xl ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-serif font-semibold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        <Link to={link}>
          <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
            Learn More →
          </Button>
        </Link>
      </div>
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${colorClass}`} />
    </div>
  );
};

export default FeatureCard;
