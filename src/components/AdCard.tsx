import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Palette, Image, Sparkles, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

interface Keywords {
  subject: string;
  action: string;
  mood: string;
  setting: string;
}

export interface AdIdea {
  hook: string;
  caption: string;
  visualSuggestion: string;
  imageUrl?: string;
  imageType?: "ai" | "stock";
  keywords?: Keywords;
}

interface AdCardProps {
  adIdea: AdIdea;
  number: number;
}

const AdCard = ({ adIdea, number }: AdCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const colors = [
    "bg-gradient-to-br from-purple-200 to-purple-400",
    "bg-gradient-to-br from-blue-200 to-blue-400",
    "bg-gradient-to-br from-green-200 to-green-400",
    "bg-gradient-to-br from-orange-200 to-orange-400",
    "bg-gradient-to-br from-pink-200 to-pink-400",
  ];
  
  const randomColor = colors[number % colors.length];

  const downloadImage = async () => {
    if (!adIdea.imageUrl) {
      toast({
        title: "No image available",
        description: "This ad doesn't have an image to download.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(adIdea.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ad-${number}-image.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Image downloaded!",
        description: "The image has been saved to your downloads folder."
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the image.",
        variant: "destructive"
      });
    }
  };

  const openInCanva = () => {
    // Encode ad details for Canva template
    const templateData = {
      heading: adIdea.hook,
      subtext: adIdea.caption,
      image: adIdea.imageUrl,
      backgroundColor: randomColor.split(' ')[1], // Use the 'from' color
    };

    const canvaUrl = new URL('https://www.canva.com/design/create');
    canvaUrl.searchParams.append('type', 'social-media');
    canvaUrl.searchParams.append('template', JSON.stringify(templateData));
    
    window.open(canvaUrl.toString(), '_blank');
    
    toast({
      title: "Opening Canva",
      description: "The template will open in a new tab. You may need to log in to Canva."
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group" ref={cardRef}>
      {/* Content Header */}
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
            #{number}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Ad Preview</span>
            <span className="text-xs text-muted-foreground">{adIdea.imageType === "ai" ? "AI Generated" : "Stock Photo"}</span>
          </div>
        </div>
        <div className={`
          px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
          ${adIdea.imageType === "ai" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}
        `}>
          {adIdea.imageType === "ai" ? (
            <>
              <Sparkles className="h-3 w-3" />
              AI Generated
            </>
          ) : (
            <>
              <Image className="h-3 w-3" />
              Stock Photo
            </>
          )}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative group">
        <AspectRatio ratio={1 / 1}>
          <div className={`w-full h-full flex items-center justify-center ${!adIdea.imageUrl || !imageLoaded || imageError ? randomColor : ''}`}>
            {adIdea.imageUrl && !imageError && (
              <img
                src={adIdea.imageUrl}
                alt={adIdea.hook}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
            {/* Hook overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
              <p className="text-white font-bold text-xl text-center leading-tight">
                {adIdea.hook}
              </p>
            </div>
          </div>
        </AspectRatio>
        
        {/* Action buttons overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={downloadImage}>
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openInCanva}>
                <Palette className="mr-2 h-4 w-4" />
                Open in Canva
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Caption and Engagement Section */}
      <div className="p-4 space-y-4">
        {/* Engagement buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isSaved ? 'text-primary' : ''}`}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <p className="font-medium">Caption</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {adIdea.caption}
          </p>
        </div>

        {/* Visual Keywords */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">#{adIdea.imageType}</span>
          <span className="text-xs text-gray-500">#{adIdea?.keywords?.mood || 'mood'}</span>
          <span className="text-xs text-gray-500">#{adIdea?.keywords?.setting || 'setting'}</span>
        </div>
      </div>
    </Card>
  );
};

export default AdCard;
