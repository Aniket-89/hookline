import { FormData } from "@/components/FormSection";
import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from 'pexels';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const pexelsClient = createClient(import.meta.env.VITE_PEXELS_API_KEY);

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
  }
};

const sanitizeJsonString = (str: string): string => {
  // Find the first '[' and last ']' to extract just the JSON array
  const start = str.indexOf('[');
  const end = str.lastIndexOf(']') + 1;
  if (start === -1 || end === -1) {
    throw new Error('No JSON array found in response');
  }
  return str.slice(start, end);
};

const generateAIImage = async (prompt: string, productImage?: string): Promise<string | null> => {
  try {
    console.log('🎨 Generating AI image with prompt:', prompt);
    
    // Format the prompt based on the visual suggestion and keywords
    const structuredPrompt = productImage
      ? `Professional product advertisement photograph: ${prompt}. Ensure clear visibility of the provided product image, maintaining its recognizable features while enhancing the scene around it. Leave sufficient negative space at the top for text overlay. Create a clean, commercial-quality composition with professional lighting and subtle shadows.`
      : `Professional product advertisement photograph: ${prompt}. Create a clean commercial composition with negative space at top for text overlay, professional studio lighting with subtle shadows, optimized for social media advertising.`;

    // If there's a product image, extract the base64 data and handle different formats
    let imageData = '';
    if (productImage) {
      const matches = productImage.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      if (matches) {
        imageData = matches[2];
      } else {
        console.warn('Invalid image format, expected base64 data URL');
        return null;
      }
    }

    // Prepare contents array for the API
    const contents = [
      {
        role: 'user',
        parts: [
          { text: structuredPrompt },
          ...(imageData ? [{
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageData
            }
          }] : [])
        ]
      }
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Extract image data from response
    if (result?.candidates?.[0]?.content?.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error('No image data in response');
  } catch (error) {
    console.error('❌ Error generating AI image:', error);
    if (error.message?.includes('inline_data')) {
      console.error('Image format error - make sure the image is in a supported format (JPG, PNG)');
    }
    return null;
  }
};

interface PexelsPhoto {
  src: {
    medium: string;
    large: string;
    original: string;
  };
}

interface PexelsResponse {
  photos?: PexelsPhoto[];
  error?: string;
}

interface VisualKeywords {
  subject: string;    // Main subject of the image
  action: string;     // What the subject is doing
  mood: string;       // Emotional tone of the image
  setting: string;    // Location or context
}

interface AdIdea {
  hook: string;
  caption: string;
  visualSuggestion: string;
  keywords: VisualKeywords;
  imageUrl?: string;
  imageType?: "ai" | "stock";
}

const searchPexelsImages = async (
  keywords: VisualKeywords, 
  count: number = 3,
  productImage?: string,
  useAI: boolean = true,
  visualSuggestion?: string,
  platform: string = "Instagram"
): Promise<{ urls: string[], type: "ai" | "stock" }> => {
  // First, optimize the visual suggestion through Gemini
  const promptOptimizationRequest = `Take this visual suggestion and turn it into a full image generation prompt suitable for gemini. Keep it under 2 sentences:
  ${visualSuggestion || `Professional product featuring ${keywords.subject} ${keywords.action} in a ${keywords.mood} ${keywords.setting} environment`}`;
  
  let enhancedPrompt = visualSuggestion;
  try {
    const optimizationResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptOptimizationRequest,
    });
    enhancedPrompt = optimizationResponse.text.trim();
    console.log('🎨 Optimized prompt:', enhancedPrompt);
  } catch (error) {
    console.warn('⚠️ Failed to optimize prompt, using original:', error);
  }

  // Generate AI image using the prompt
  const imageUrl = await generateAIImage(enhancedPrompt, productImage);
  if (imageUrl) {
    return { urls: [imageUrl], type: "ai" };
  }

  // If AI generation fails, return empty result
  console.error('❌ AI image generation failed');
  return { urls: [], type: "ai" };
};

const generateAdContent = async (
  product: string,
  customers: string,
  uniqueFeature: string,
  platform: string,
  productImage?: string,
  preferredImageType: "ai" | "stock" | "mixed" = "mixed"
) => {
  console.log('🎯 Generating ad content with params:', { 
    product, 
    customers, 
    uniqueFeature, 
    platform,
    hasProductImage: !!productImage 
  });

  const prompt = `You are an expert social media ad copywriter. Generate exactly 3 ads in valid JSON format.

IMPORTANT: Your entire response must be valid JSON. Do not include any extra text, markdown, or formatting.
Respond with only a JSON array containing exactly 3 objects.

Create ads for:
Product: ${product}
Target Audience: ${customers}
Unique Feature: ${uniqueFeature}
Platform: ${platform}

Required JSON format:
[
  {
    "hook": "attention-grabbing headline under 100 chars",
    "caption": "compelling body text (platform appropriate)",
    "visualSuggestion": "detailed visual description for AI image generation, focus on composition, lighting, mood, and styling",
    "keywords": {
      "subject": "main subject or focus (1-2 words)",
      "action": "what the subject is doing (1-2 words)",
      "mood": "emotional tone (1 word: happy, peaceful, energetic, etc)",
      "setting": "location or context (1-2 words)"
    }
  }
]

Guidelines:
- Make each ad's keywords distinctly different from others
- Use simple, common words for keywords that work well with stock photos
- Hooks: Short, punchy, under 100 characters
- Captions: Concise, engaging, match ${platform}'s style
- Each ad should have a different mood and setting
- Focus on lifestyle and emotional appeal`;

  try {
    console.log('🚀 Sending request to Gemini API...');
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    const text = response.text;
    console.log('📄 Raw response text:', text);
    
    try {
      let parsedResponse: Array<AdIdea>;
      try {
        parsedResponse = JSON.parse(text) as Array<AdIdea>;
      } catch (firstParseError) {
        const sanitized = sanitizeJsonString(text);
        parsedResponse = JSON.parse(sanitized) as Array<AdIdea>;
      }

      if (!Array.isArray(parsedResponse) || parsedResponse.length !== 3) {
        throw new Error('Invalid response structure: expected array of 3 items');
      }

      // Validate and clean up keywords
      parsedResponse = parsedResponse.map(ad => ({
        ...ad,
        keywords: {
          subject: ad.keywords?.subject?.toLowerCase()?.trim() || product,
          action: ad.keywords?.action?.toLowerCase()?.trim() || 'using',
          mood: ad.keywords?.mood?.toLowerCase()?.trim() || 'happy',
          setting: ad.keywords?.setting?.toLowerCase()?.trim() || 'lifestyle'
        }
      }));

      // Generate AI images for all ads using their visual prompts
      console.log('🖼️ Generating AI images for ads...');
      const adsWithImages = await Promise.all(
        parsedResponse.map(async (ad, index) => {
          const { urls, type } = await searchPexelsImages(
            ad.keywords,
            1,
            index === 0 ? productImage : undefined,
            true, // Always use AI
            ad.visualSuggestion,
            platform
          );
          return {
            ...ad,
            imageUrl: urls[0],
            imageType: type
          };
        })
      );

      console.log('✨ Successfully generated ads with different images:', adsWithImages);
      return adsWithImages;

    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError);
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}`);
    }
  } catch (error) {
    console.error('❌ Error generating ad content:', error);
    console.log('⚠️ Falling back to default templates');
    
    const { ctas, format } = getPlatformElements(platform);
    
    // Create distinctly different fallback ads
    const fallbackAds = await Promise.all(
      [
        {
          mood: 'happy',
          action: 'using',
          setting: 'home',
          style: 'lifestyle',
          useAI: true // Always use AI
        },
        {
          mood: 'excited',
          action: 'enjoying',
          setting: 'outdoors',
          style: 'action',
          useAI: true
        },
        {
          mood: 'peaceful',
          action: 'showcasing',
          setting: 'studio',
          style: 'professional',
          useAI: true
        }
      ].map(async (variation, i) => {
        const keywords: VisualKeywords = {
          subject: product.toLowerCase(),
          action: variation.action,
          mood: variation.mood,
          setting: variation.setting
        };
        
        // Use product image for the first fallback ad if provided
        const visualSuggestion = [
          `Professional lifestyle ${format} showing ${keywords.mood} person ${keywords.action} ${product} in a well-lit ${keywords.setting} setting. Composition optimized for social media with negative space for text overlay. Natural, authentic feel with professional lighting.`,
          `Dynamic commercial ${format} capturing ${keywords.mood} moment with ${product} in an aesthetic ${keywords.setting} environment. Soft, diffused lighting with subtle shadows. Modern, aspirational composition with room for text.`,
          `Premium product ${format} featuring ${product} being ${keywords.action} in a ${keywords.mood} ${keywords.setting} scene. Studio-quality lighting with clean shadows. Minimalist, high-end composition with perfect balance.`
        ][i];

        const { urls, type } = await searchPexelsImages(
          keywords,
          1,
          i === 0 ? productImage : undefined,
          variation.useAI,
          visualSuggestion
        );
        
        return {
          hook: [
            `Discover our innovative ${product}`,
            `Transform your life with our ${product}`,
            `Experience the magic of our ${product}`
          ][i],
          caption: [
            `Designed for ${customers}, featuring ${uniqueFeature}. ${ctas[0]}!`,
            `Perfect for ${customers}. ${uniqueFeature} makes all the difference. ${ctas[Math.min(1, ctas.length - 1)]}!`,
            `Join countless ${customers} who love our ${uniqueFeature}. ${ctas[Math.min(2, ctas.length - 1)]}!`
          ][i],
          visualSuggestion: [
            `${format} showing ${keywords.mood} person ${keywords.action} ${product} at ${keywords.setting}`,
            `${format} capturing ${keywords.mood} moment with ${product} in ${keywords.setting}`,
            `${format} featuring professional ${keywords.action} of ${product} in ${keywords.setting}`
          ][i],
          keywords,
          imageUrl: urls[0],
          imageType: type
        };
      })
    );
    
    console.log('🔄 Generated fallback ads with different images:', fallbackAds);
    return fallbackAds;
  }
};

export const generateAdIdeas = async (formData: FormData): Promise<AdIdea[]> => {
  console.log('📥 Received form data:', formData);
  const { product, customers, uniqueFeature, platform, productImage } = formData;
  const result = await generateAdContent(
    product,
    customers,
    uniqueFeature,
    platform,
    productImage
  );
  console.log('📤 Returning final ad ideas:', result);
  return result;
};
