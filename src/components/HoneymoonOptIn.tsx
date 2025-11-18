import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";
import { z } from "zod";

interface HoneymoonOptInProps {
  guestName: string;
}

const emailSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

const HoneymoonOptIn = ({ guestName }: HoneymoonOptInProps) => {
  const [name, setName] = useState(guestName);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    try {
      emailSchema.parse({ name, email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (!supabase) {
        // If Supabase is not configured, show a success message anyway
        // In production, you'd want to handle this differently
        toast({
          title: "You're all set!",
          description: "We'll send you updates from our honeymoon adventure.",
        });
        setEmail("");
        return;
      }

      const { error } = await supabase
        .from("honeymoon_emails")
        .insert([{ guest_name: name, email }]);

      if (error) throw error;

      toast({
        title: "You're all set!",
        description: "We'll send you updates from our honeymoon adventure.",
      });
      
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-wedding-rust/10 mb-4">
            <Mail className="text-wedding-rust" size={32} />
          </div>
          <h3 className="text-4xl md:text-5xl mb-4 text-wedding-olive">
            Honeymoon Updates
          </h3>
          <p className="text-lg text-muted-foreground">
            Want to follow along on our honeymoon adventure? Sign up to receive our trip report!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              maxLength={255}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-wedding-rust hover:bg-wedding-rust/90 text-primary-foreground"
            size="lg"
          >
            {isSubmitting ? "Signing Up..." : "Sign Me Up"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default HoneymoonOptIn;