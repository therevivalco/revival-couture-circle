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
    <Link to={link} className="block">
      <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-500 hover:shadow-lg cursor-pointer hover:scale-105">
        <div className="p-8 space-y-4">
          <div className={`inline-flex p-3 rounded-xl ${colorClass} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-serif font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
          <div className="flex items-center text-foreground group-hover:translate-x-1 transition-transform">
            Learn More →
          </div>
        </div>
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${colorClass}`} />
      </div>
    </Link>
  );
};

export default FeatureCard;
