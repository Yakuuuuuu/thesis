import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GuestRegistration from "@/components/guest/GuestRegistration";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const GuestRegistrationPage = () => {
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const res = await fetch('/api/v1/public/rooms/available');
        const data = await res.json();
        if (res.ok) {
          setAvailableRooms(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch available rooms');
        }
      } catch (err: any) {
        toast({ title: 'Error fetching available rooms', description: err.message, variant: 'destructive' });
      }
    };

    fetchAvailableRooms();
  }, []);

  const handleRegistrationComplete = (newGuestData: any) => {
    // After successful registration, redirect to room controls (home page)
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Guest Registration – AetherStay" 
        description="Register for your stay at AetherStay. Choose your room and provide your details." 
        path="/register" 
      />
      <Navbar />
      
      <main className="container mx-auto flex-1 py-10 flex justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to AetherStay</h1>
            <p className="text-muted-foreground">Register for your stay</p>
          </div>
          
          <GuestRegistration 
            onRegistrationComplete={handleRegistrationComplete} 
            rooms={availableRooms}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuestRegistrationPage; 