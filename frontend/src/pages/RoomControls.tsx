import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ServiceRequestModal, { ServiceRequestValues } from "@/components/guest/ServiceRequestModal";
import GuestRegistration from "@/components/guest/GuestRegistration";
import GuestInfo from "@/components/guest/GuestInfo";
import AIAssistant from "@/components/ai/AIAssistant";
import RoomTabs from "@/components/room/RoomTabs";
import { Link, useNavigate } from "react-router-dom";

interface RoomControlState {
  lightOn: boolean;
  brightness: number; // 0-100
  acPower: boolean;
  temperature: number; // 16-30
  mode: "cool" | "heat" | "auto";
  fan: "low" | "medium" | "high";
}

const defaultState = (): RoomControlState => ({
  lightOn: true,
  brightness: 70,
  acPower: true,
  temperature: 22,
  mode: "cool",
  fan: "medium",
});

const RoomControls = () => {
  const navigate = useNavigate();
  const initialMap = useMemo(
    () => ({}),
    []
  );
  const [stateByRoom, setStateByRoom] = useState<Record<string, RoomControlState>>(initialMap);
  const assignedRoom = typeof window !== "undefined" ? localStorage.getItem("assignedRoom") : null;
  const [selectedRoom, setSelectedRoom] = useState<string | null>(assignedRoom);
  const [modalOpen, setModalOpen] = useState(false);
  const [guestData, setGuestData] = useState<any>(null);
  const [showRegistration, setShowRegistration] = useState(!assignedRoom);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  const handleRegistrationComplete = (newGuestData: any) => {
    setGuestData(newGuestData);
    setShowRegistration(false);
    setSelectedRoom(newGuestData.room_number);
    window.location.reload(); // Refresh to update assigned room
  };

  useEffect(() => {
    const fetchOccupiedRooms = async () => {
      try {
        const res = await fetch('/api/v1/public/guests');
        const data = await res.json();
        if (res.ok) {
          const occupiedRooms = data.data.map((guest: any) => guest.roomNumber);
          const newStates = Object.fromEntries(occupiedRooms.map((id: string) => [id, defaultState()]));
          setStateByRoom(newStates);
          if (!selectedRoom && occupiedRooms.length > 0) {
            setSelectedRoom(occupiedRooms[0]);
          }
          if (occupiedRooms.length > 0) {
            setShowRegistration(false);
          }
        } else {
          throw new Error(data.error || 'Failed to fetch occupied rooms');
        }
      } catch (err: any) {
        toast({ title: 'Error fetching rooms', description: err.message, variant: 'destructive' });
      }
    };

    fetchOccupiedRooms();
  }, [assignedRoom]);

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

  useEffect(() => {
    const fetchGuestData = async () => {
      if (selectedRoom) {
        try {
          const response = await fetch(`/api/v1/public/guests/room/${selectedRoom}`);
          if (response.ok) {
            const data = await response.json();
            setGuestData(data.data);
            setShowRegistration(false);
          } else {
            setGuestData(null);
            setShowRegistration(true);
          }
        } catch (error) {
          setGuestData(null);
          setShowRegistration(true);
        }
      } else {
        setGuestData(null);
        setShowRegistration(true);
      }
    };

    fetchGuestData();
  }, [selectedRoom]);

  const state = selectedRoom ? stateByRoom[selectedRoom] : null;

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container mx-auto flex-1 py-10 flex justify-center items-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to AetherStay</h1>
              <p className="text-muted-foreground">Choose how you'd like to proceed</p>
            </div>
            
            <div className="grid gap-4">
              <Button 
                className="w-full h-12 text-lg" 
                onClick={() => window.location.href = '/auth'}
              >
                Sign In
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue as guest</span>
                </div>
              </div>
              
                              <Button 
                  variant="outline"
                  className="w-full h-12 text-lg" 
                  onClick={() => window.location.href = '/register'}
                >
                  Register for New Stay
                </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const update = (patch: Partial<RoomControlState>) => {
    setStateByRoom((prev) => ({
      ...prev,
      [selectedRoom]: { ...prev[selectedRoom], ...patch },
    }));
  };

  const handleServiceSubmit = async (values: ServiceRequestValues) => {
    const roomNumber = assignedRoom ?? selectedRoom;
    try {
      const response = await fetch('/api/v1/public/servicerequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumber, category: values.category, request: values.details }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send request');
      }
      toast({ title: "Request sent", description: `We received your ${values.category} request for room ${roomNumber}.` });
    } catch (error: any) {
      toast({ title: "Request failed", description: error.message, variant: 'destructive' });
    }
  };

  const handleCheckout = async () => {
    console.log("Checking out guest:", guestData);
    if (!guestData?.roomNumber) return;

    try {
      const response = await fetch(`/api/v1/public/guests/checkout/${guestData.roomNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to checkout');
      }

      toast({ title: "Checked out", description: "You have successfully checked out." });
      
      console.log("Attempting to navigate to thank you page with room:", guestData.roomNumber);
      
      // Clear guest data and state immediately after successful checkout
      setGuestData(null);
      setShowRegistration(true);
      setSelectedRoom(null);
      localStorage.removeItem('assignedRoom');
      
      // Clear the room state from stateByRoom to trigger the "no state" condition
      setStateByRoom(prev => {
        const newState = { ...prev };
        delete newState[guestData.roomNumber];
        return newState;
      });
      
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        // Try using window.location.href as a fallback if navigate doesn't work
        try {
          // Navigate to thank you page with room number
          navigate("/thank-you", { 
            state: { roomNumber: guestData.roomNumber },
            replace: true 
          });
          console.log("Navigation completed");
        } catch (navError) {
          console.error("Navigation failed, using fallback:", navError);
          // Fallback to direct navigation
          window.location.href = `/thank-you?room=${guestData.roomNumber}`;
        }
      }, 100);
      
    } catch (error: any) {
      toast({ title: "Checkout failed", description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Room Controls – Lights & AC per Room"
        description="Control room lights (brightness) and AC settings. Assign and manage per hotel room."
        path="/"
      />
      <Navbar rightSlot={
        <div className="flex items-center gap-2">
          {assignedRoom && <RoomTabs rooms={[assignedRoom]} value={assignedRoom} onValueChange={() => {}} />}
          <Button variant="outline" onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/auth';
          }}>
            {localStorage.getItem('token') ? 'Sign Out' : 'Sign In'}
          </Button>
        </div>
      } />
      <main className="container mx-auto flex-1 py-10">
        {showRegistration ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome to AetherStay</h1>
                <p className="text-muted-foreground">Choose how you'd like to proceed</p>
              </div>
              
              <div className="grid gap-4">
                <Button 
                  className="w-full h-12 text-lg" 
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue as guest</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full h-12 text-lg" 
                  onClick={() => window.location.href = '/register'}
                >
                  Register for New Stay
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <aside className="space-y-4">
              {guestData && (
                <GuestInfo 
                  guestData={guestData} 
                  onCheckout={handleCheckout} 
                />
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Request Room Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Order food or ask housekeeping for help.</p>
                  <Button className="w-full" onClick={() => setModalOpen(true)} disabled={!assignedRoom && !selectedRoom}>
                    New request
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Room {selectedRoom}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Light: {state.lightOn ? "On" : "Off"} · {state.brightness}%
                    </li>
                    <li>
                      AC: {state.acPower ? "On" : "Off"} · {state.temperature}°C · {state.mode} · {state.fan}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </aside>

            <section className="md:col-span-2 space-y-6">
              <h1 className="text-3xl font-semibold tracking-tight">Room Controls</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Lights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="light-power">Power</Label>
                      <p className="text-xs text-muted-foreground">Turn lights on or off</p>
                    </div>
                    <Switch id="light-power" checked={state.lightOn} onCheckedChange={(v) => update({ lightOn: v })} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="brightness">Brightness</Label>
                      <span className="text-sm text-muted-foreground">{state.brightness}%</span>
                    </div>
                    <Slider
                      id="brightness"
                      min={0}
                      max={100}
                      step={1}
                      value={[state.brightness]}
                      onValueChange={(v) => update({ brightness: v[0] ?? 0 })}
                      aria-label="Brightness percentage"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Air Conditioning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="ac-power">Power</Label>
                      <p className="text-xs text-muted-foreground">Turn AC on or off</p>
                    </div>
                    <Switch id="ac-power" checked={state.acPower} onCheckedChange={(v) => update({ acPower: v })} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperature">Temperature</Label>
                      <span className="text-sm text-muted-foreground">{state.temperature}°C</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={16}
                      max={30}
                      step={1}
                      value={[state.temperature]}
                      onValueChange={(v) => update({ temperature: v[0] ?? 22 })}
                      aria-label="Temperature in Celsius"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mode">Mode</Label>
                      <Select value={state.mode} onValueChange={(v: RoomControlState["mode"]) => update({ mode: v })}>
                        <SelectTrigger id="mode">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-popover">
                          <SelectItem value="cool">Cool</SelectItem>
                          <SelectItem value="heat">Heat</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fan">Fan</Label>
                      <Select value={state.fan} onValueChange={(v: RoomControlState["fan"]) => update({ fan: v })}>
                        <SelectTrigger id="fan">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-popover">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  Settings are saved per room automatically.
                </CardFooter>
              </Card>
            </section>
          </div>
        )}
      </main>

      <ServiceRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleServiceSubmit}
        roomNumber={assignedRoom ?? selectedRoom}
      />

      <AIAssistant />
      <Footer />
    </div>
  );
};

export default RoomControls;
