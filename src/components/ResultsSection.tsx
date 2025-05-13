
import { Copy, Download, RefreshCw } from "lucide-react";
import AdCard, { AdIdea } from "./AdCard";
import { toast } from "@/components/ui/use-toast";

interface ResultsSectionProps {
  adIdeas: AdIdea[];
  onReset: () => void;
  formData: any;
}

const ResultsSection = ({ adIdeas, onReset, formData }: ResultsSectionProps) => {
  const handleCopyAll = () => {
    try {
      const text = adIdeas
        .map(
          (idea, index) =>
            `AD IDEA ${index + 1}\nHook: ${idea.hook}\nCaption: ${idea.caption}\nVisual: ${idea.visualSuggestion}\n\n`
        )
        .join("");
      navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    } catch (err) {
      toast({ 
        title: "Failed to copy", 
        description: "Please try again",
        variant: "destructive" 
      });
    }
  };

  const handleDownloadPDF = () => {
    toast({ 
      title: "Coming soon!", 
      description: "PDF download will be available in our next update."
    });
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/10 animate-fade-in">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Here's your Ad Pack!</h2>
          <p className="text-muted-foreground mb-6">
            Ready-to-use ad ideas for your {formData.product} on {formData.platform}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button onClick={handleCopyAll} className="btn-secondary flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy All
            </button>
            <button onClick={handleDownloadPDF} className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button onClick={onReset} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Another Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adIdeas.map((idea, index) => (
            <div key={index} className="animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <AdCard adIdea={idea} number={index + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
