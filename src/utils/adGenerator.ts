
import { FormData } from "@/components/FormSection";
import { AdIdea } from "@/components/AdCard";

// Helper function to get platform-specific elements
const getPlatformElements = (platform: string) => {
  switch (platform) {
    case "Facebook":
      return {
        ctas: ["Learn More", "Shop Now", "Sign Up", "Contact Us"],
        format: "carousel ad, video ad, or static image",
      };
    case "Instagram":
      return {
        ctas: ["Swipe Up", "Tap to Shop", "DM for Details"],
        format: "story, reel, or carousel post",
      };
    case "WhatsApp":
      return {
        ctas: ["Message Us", "Click to Chat", "Get Quote"],
        format: "status update or direct message",
      };
    default:
      return {
        ctas: ["Learn More", "Get Started", "Contact Now"],
        format: "banner ad or sponsored post",
      };
  };
};

// Generate hooks based on product type
const generateHook = (product: string, customers: string, uniqueFeature: string) => {
  const hooks = [
    `"Tired of ordinary ${product.toLowerCase()}? Discover what makes ours different."`,
    `"Attention ${customers}: This ${product.toLowerCase()} will change how you think about [category]."`,
    `"The secret to better [benefit] is here. Introducing our ${uniqueFeature.toLowerCase()} ${product.toLowerCase()}."`,
    `"[Problem]? Our ${product.toLowerCase()} with ${uniqueFeature.toLowerCase()} is the solution you've been searching for."`,
    `"This ${product.toLowerCase()} has helped thousands of ${customers.toLowerCase()} achieve [desired outcome]."`,
    `"What if you could [desired outcome] with just one ${product.toLowerCase()}?"`,
  ];
  
  // Shuffle and pick different hooks
  return hooks.sort(() => 0.5 - Math.random());
};

// Generate captions
const generateCaption = (product: string, customers: string, uniqueFeature: string, platform: string) => {
  const { ctas } = getPlatformElements(platform);
  const randomCta = ctas[Math.floor(Math.random() * ctas.length)];
  
  const captions = [
    `Introducing our ${uniqueFeature.toLowerCase()} ${product.toLowerCase()} designed specifically for ${customers.toLowerCase()}. We've spent years perfecting this to ensure you get the [benefit] you deserve. No more [pain point]! [Emoji] ${randomCta}!`,
    
    `Our ${product.toLowerCase()} isn't for everyone. But if you're serious about [desired outcome], you'll love how our ${uniqueFeature.toLowerCase()} feature makes all the difference. Made with [quality detail] for ${customers.toLowerCase()} who expect more. ${randomCta} [Emoji]`,
    
    `We created this ${product.toLowerCase()} because we were frustrated with [problem]. Now, thanks to our ${uniqueFeature.toLowerCase()}, ${customers.toLowerCase()} like you can finally enjoy [benefit] without worrying about [pain point]. ${randomCta}!`,
  ];
  
  return captions.sort(() => 0.5 - Math.random());
};

// Generate visual suggestions
const generateVisualSuggestion = (product: string, uniqueFeature: string, platform: string) => {
  const { format } = getPlatformElements(platform);
  
  const suggestions = [
    `${format} showing the ${product.toLowerCase()} being used by a satisfied customer, highlighting the ${uniqueFeature.toLowerCase()} feature with text overlay explaining the benefits.`,
    
    `Before/after ${format} demonstrating the problem without your ${product.toLowerCase()} and the solution with it. Focus on capturing the emotional benefit.`,
    
    `Close-up detail ${format} of your ${product.toLowerCase()}'s ${uniqueFeature.toLowerCase()} with bright, attention-grabbing colors and simple text highlighting your main selling point.`,
  ];
  
  return suggestions.sort(() => 0.5 - Math.random());
};

export const generateAdIdeas = (formData: FormData): AdIdea[] => {
  const { product, customers, uniqueFeature, platform } = formData;
  
  const hooks = generateHook(product, customers, uniqueFeature);
  const captions = generateCaption(product, customers, uniqueFeature, platform);
  const visualSuggestions = generateVisualSuggestion(product, uniqueFeature, platform);
  
  // Create 3 ad ideas
  return Array.from({ length: 3 }, (_, i) => ({
    hook: hooks[i],
    caption: captions[i],
    visualSuggestion: visualSuggestions[i],
  }));
};
