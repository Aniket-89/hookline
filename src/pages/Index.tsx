import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import FormSection, { FormData } from "@/components/FormSection";
import ResultsSection from "@/components/ResultsSection";
import { generateAdIdeas } from "@/utils/adGenerator";
import { AdIdea } from "@/components/AdCard";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [adIdeas, setAdIdeas] = useState<AdIdea[] | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const generatedIdeas = await generateAdIdeas(data);
      setAdIdeas(generatedIdeas);
      setFormData(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ad ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAdIdeas(null);
    setFormData(null);
    scrollToForm();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {adIdeas && formData ? (
        <ResultsSection adIdeas={adIdeas} onReset={handleReset} formData={formData} />
      ) : (
        <>
          <HeroSection onGetStarted={scrollToForm} />
          <div ref={formRef}>
            <FormSection onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        </>
      )}
      <Toaster />
    </main>
  );
};

export default Index;
