
import { useState, useRef, FormEvent } from "react";
import { useToast } from "@/components/ui/use-toast";

interface FormSectionProps {
  onSubmit: (formData: FormData) => void;
  formRef: React.RefObject<HTMLDivElement>;
}

export interface FormData {
  product: string;
  customers: string;
  uniqueFeature: string;
  platform: string;
}

const FormSection = ({ onSubmit, formRef }: FormSectionProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    product: "",
    customers: "",
    uniqueFeature: "",
    platform: "Facebook",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.product || !formData.customers || !formData.uniqueFeature) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to generate ad ideas.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate loading for better UX
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <section ref={formRef} className="py-16 bg-white" id="form-section">
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
                onChange={handleChange}
                placeholder="e.g., Handmade scented candles"
                className="input-field"
              />
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="e.g., Long-lasting, eco-friendly ingredients, unique scents"
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="platform" className="block text-sm font-medium mb-2">
                What platform are you posting on?
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button 
                type="submit" 
                className="btn-accent w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating Ideas..." : "Get My Ad Ideas"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormSection;
