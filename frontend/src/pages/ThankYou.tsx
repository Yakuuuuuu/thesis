import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface FeedbackData {
  rating: string;
  feedback: string;
  roomNumber: string;
}

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get room number from location state, URL params, or default
  const roomNumber = location.state?.roomNumber || 
    new URLSearchParams(location.search).get('room') || 
    "your room";

  const handleFeedbackSubmit = async () => {
    if (!rating || !feedback.trim()) {
      toast({ 
        title: "Please complete the form", 
        description: "Please provide both a rating and feedback.", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/public/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber,
          rating,
          feedback: feedback.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({ 
        title: "Thank you!", 
        description: "Your feedback has been submitted successfully." 
      });

      // Navigate to guest registration page immediately after successful submission
      navigate("/register", { replace: true });

    } catch (error: any) {
      toast({ 
        title: "Feedback submission failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipFeedback = () => {
    // Navigate to guest registration page
    navigate("/register", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Thank You for Staying – AetherStay" 
        description="Thank you for choosing AetherStay. We hope you enjoyed your stay!" 
        path="/thank-you" 
      />
      <Navbar />
      
      <main className="container mx-auto flex-1 py-10 flex justify-center items-center">
        <div className="w-full max-w-2xl space-y-8">
          {/* Thank You Message */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-green-600">
              Thank You for Staying!
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              We hope you enjoyed your stay at AetherStay. Your comfort and satisfaction are our top priorities.
            </p>
            
            <div className="text-sm text-muted-foreground">
              Room {roomNumber} • Checked out successfully
            </div>
          </div>

          {/* Feedback Form */}
          <Card className="border-2 border-dashed border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-green-700">
                Help Us Improve Your Experience
              </CardTitle>
              <p className="text-muted-foreground">
                Your feedback helps us provide better service for future guests
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="rating">How would you rate your stay?</Label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Select your rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent (5 stars)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Very Good (4 stars)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Good (3 stars)</SelectItem>
                    <SelectItem value="2">⭐⭐ Fair (2 stars)</SelectItem>
                    <SelectItem value="1">⭐ Poor (1 star)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">
                  Tell us about your experience (optional but appreciated)
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="What did you like? What could we improve? Any suggestions for future guests?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleFeedbackSubmit} 
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleSkipFeedback}
                  className="flex-1"
                >
                  Skip Feedback
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>We hope to welcome you back to AetherStay soon!</p>
              <p className="mt-2">
                For any questions about your stay, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou; 