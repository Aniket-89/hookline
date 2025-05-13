
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  // Generate a random pastel background color for image placeholder
  const colors = [
    "bg-gradient-to-br from-purple-200 to-purple-400",
    "bg-gradient-to-br from-blue-200 to-blue-400",
    "bg-gradient-to-br from-green-200 to-green-400",
    "bg-gradient-to-br from-orange-200 to-orange-400",
    "bg-gradient-to-br from-pink-200 to-pink-400",
  ];
  
  const randomColor = colors[number % colors.length];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative">
        <AspectRatio ratio={1 / 1}>
          <div className={`w-full h-full flex items-center justify-center ${randomColor}`}>
            {/* Image placeholder with hook overlay */}
            <div className="absolute inset-0 p-4 flex items-center justify-center">
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg w-full">
                <p className="text-white font-bold text-xl text-center leading-tight">
                  {adIdea.hook}
                </p>
              </div>
            </div>
            <div className="absolute top-3 right-3 bg-primary text-white font-medium rounded-full h-8 w-8 flex items-center justify-center shadow-md">
              {number}
            </div>
          </div>
        </AspectRatio>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Caption</h3>
          <p className="text-gray-700 text-sm line-clamp-3">{adIdea.caption}</p>
        </div>
        
        <div>
          <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Visual Suggestion</h3>
          <p className="text-gray-700 text-sm line-clamp-3">{adIdea.visualSuggestion}</p>
        </div>
      </div>
    </Card>
  );
};

export default AdCard;
