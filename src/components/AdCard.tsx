
import { Card } from "@/components/ui/card";

export interface AdIdea {
  hook: string;
  caption: string;
  visualSuggestion: string;
}

interface AdCardProps {
  adIdea: AdIdea;
  number: number;
}

const AdCard = ({ adIdea, number }: AdCardProps) => {
  return (
    <Card className="card hover:shadow-lg group">
      <div className="absolute top-4 right-4 bg-primary/10 text-primary font-medium rounded-full h-8 w-8 flex items-center justify-center">
        {number}
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg">Hook</h3>
          <p className="text-gray-700">{adIdea.hook}</p>
        </div>
        
        <div>
          <h3 className="font-bold text-lg">Caption</h3>
          <p className="text-gray-700">{adIdea.caption}</p>
        </div>
        
        <div>
          <h3 className="font-bold text-lg">Visual Suggestion</h3>
          <p className="text-gray-700">{adIdea.visualSuggestion}</p>
        </div>
      </div>
    </Card>
  );
};

export default AdCard;
