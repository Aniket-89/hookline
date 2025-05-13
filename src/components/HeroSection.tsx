
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Stuck writing ads? Get 3 ad ideas in 30 seconds.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Just tell us what you sell, we'll do the rest. No logins. No jargon. Just results.
          </p>
          <button 
            onClick={onGetStarted} 
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            Start Now
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
