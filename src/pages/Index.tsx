
import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import FormSection, { FormData } from "@/components/FormSection";
import ResultsSection from "@/components/ResultsSection";
import { generateAdIdeas } from "@/utils/adGenerator";
import { AdIdea } from "@/components/AdCard";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [adIdeas, setAdIdeas] = useState<AdIdea[] | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = (data: FormData) => {
    const generatedIdeas = generateAdIdeas(data);
    setAdIdeas(generatedIdeas);
    setFormData(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setAdIdeas(null);
    scrollToForm();
  };

  return (
    <div className="min-h-screen">
      <Toaster />
      
      {!adIdeas ? (
        <>
          <HeroSection scrollToForm={scrollToForm} />
          <FormSection onSubmit={handleFormSubmit} formRef={formRef} />
        </>
      ) : (
        <ResultsSection 
          adIdeas={adIdeas} 
          onReset={handleReset}
          formData={formData}
        />
      )}
      
      <footer className="py-6 bg-background border-t">
        <div className="container-custom text-center text-sm text-muted-foreground">
          Ad Idea Generator • Create effective ads in seconds
        </div>
      </footer>
    </div>
  );
};

export default Index;
