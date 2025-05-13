import { useState, FormEvent, ChangeEvent } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImagePlus, X, Image, Sparkles } from "lucide-react";

interface FormSectionProps {
  onSubmit: (formData: FormData) => void | Promise<void>;
  isLoading?: boolean;
}

export interface FormData {
  product: string;
  customers: string;
  uniqueFeature: string;
  platform: "Facebook" | "Instagram" | "WhatsApp";
  productImage?: string; // Base64 encoded image
  preferredImageType: "ai" | "stock" | "mixed";
}

const FormSection = ({ onSubmit, isLoading }: FormSectionProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    product: "",
    customers: "",
    uniqueFeature: "",
    platform: "Facebook",
    preferredImageType: "mixed"
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData(prev => ({
        ...prev,
        productImage: base64String
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => {
      const { productImage, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.product || !formData.customers || !formData.uniqueFeature) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <section className="py-16 bg-white" id="form-section">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Tell us about your product</h2>
            <p className="text-muted-foreground">
              Share a few details and we'll create tailored ad ideas for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="product" className="block text-sm font-medium mb-2">
                What do you sell?
              </label>
              <input
                id="product"
                name="product"
                type="text"
                value={formData.product}
                onChange={(e) => handleInputChange("product", e.target.value)}
                placeholder="e.g., Handmade scented candles"
                className="input-field"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Image (optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="max-h-40 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="product-image"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
                        >
                          <span>Upload an image</span>
                          <input
                            id="product-image"
                            name="product-image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="customers" className="block text-sm font-medium mb-2">
                Who are your customers?
              </label>
              <input
                id="customers"
                name="customers"
                type="text"
                value={formData.customers}
                onChange={(e) => handleInputChange("customers", e.target.value)}
                placeholder="e.g., Home decor enthusiasts, gift shoppers"
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="uniqueFeature" className="block text-sm font-medium mb-2">
                What's special about your product or service?
              </label>
              <input
                id="uniqueFeature"
                name="uniqueFeature"
                type="text"
                value={formData.uniqueFeature}
                onChange={(e) => handleInputChange("uniqueFeature", e.target.value)}
                placeholder="e.g., Long-lasting, eco-friendly ingredients, unique scents"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-4">
                Preferred Image Type
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("preferredImageType", "ai")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                    formData.preferredImageType === "ai"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  AI Generated
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("preferredImageType", "stock")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                    formData.preferredImageType === "stock"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image className="h-4 w-4" />
                  Stock Photos
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("preferredImageType", "mixed")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                    formData.preferredImageType === "mixed"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image className="h-4 w-4" />
                  Mixed
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-medium mb-2">
                What platform are you posting on?
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={(e) => handleInputChange("platform", e.target.value)}
                className="input-field"
              >
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isLoading ? "Generating Ideas..." : "Get My Ad Ideas"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormSection;
