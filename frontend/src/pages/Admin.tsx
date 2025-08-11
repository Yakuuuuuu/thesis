import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Dashboard from "@/components/admin/Dashboard";

interface ServiceRequest {
  _id: string;
  roomNumber: string;
  request: string;
  status: string;
  createdAt: string;
  guest: {
    name: string;
  };
  assignedTo?: string;
}

const Admin = () => {
  const [assignRoom, setAssignRoom] = useState("");
  const [guestTab, setGuestTab] = useState<"dashboard" | "requests" | "guests">("dashboard");
  const [assignTo, setAssignTo] = useState<string>("");
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to auth page if no token
      window.location.href = "/auth";
      return;
    }
  }, []);

  const fetchServiceRequests = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/v1/servicerequests", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  };

  const fetchGuests = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/v1/guests", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  };

  const fetchFeedback = async () => {
    const response = await fetch("/api/v1/public/feedback");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  };

  const handleCheckout = async (guestId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/v1/guests/checkout/${guestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to checkout guest");
      }
      refetchGuests(); // Refetch guests to update the UI
      alert("Guest checked out successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to checkout guest.");
    }
  };

  const {
    data: serviceRequests,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useQuery<ServiceRequest[]>({
    queryKey: ["service_requests"],
    queryFn: fetchServiceRequests,
    enabled: !!localStorage.getItem("token"), // Only run when authenticated
  });

  const {
    data: guests,
    isLoading: isLoadingGuests,
    refetch: refetchGuests,
  } = useQuery<any[]>({
    queryKey: ["guests"],
    queryFn: fetchGuests,
    enabled: !!localStorage.getItem("token"), // Only run when authenticated
  });

  const {
    data: feedbackData,
    isLoading: isLoadingFeedback,
    refetch: refetchFeedback,
  } = useQuery<any[]>({
    queryKey: ["feedback"],
    queryFn: fetchFeedback,
    enabled: !!localStorage.getItem("token"), // Only run when authenticated
  });

  const handleAssign = async (requestId: string) => {
    if (!assignTo) {
      alert("Please select who to assign the request to");
      return;
    }
    
    const token = localStorage.getItem("token");
    try {
      // For now, we'll use a simple string assignment
      // In a real system, you'd create User records for waiter/housekeeping
      const response = await fetch(
        `/api/v1/servicerequests/${requestId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assignedTo: assignTo }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to assign request");
      }
      refetchRequests(); // Refetch the service requests to update the UI
      setAssignTo(""); // Reset selection
      setAssigningRequestId(null); // Close assignment mode
    } catch (error) {
      console.error(error);
      alert("Failed to assign request.");
    }
  };

  const startAssign = (requestId: string) => {
    setAssigningRequestId(requestId);
    setAssignTo("");
  };

  const cancelAssign = () => {
    setAssigningRequestId(null);
    setAssignTo("");
  };

  const handleComplete = async (requestId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `/api/v1/servicerequests/${requestId}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to complete request");
      }
      refetchRequests(); // Refetch the service requests to update the UI
    } catch (error) {
      console.error(error);
      alert("Failed to complete request.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Admin – Service Requests"
        description="View guest room service and food order requests."
        path="/admin"
      />
      <Navbar
        rightSlot={
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth";
            }}
          >
            Sign Out
          </Button>
        }
      />
      <main className="container mx-auto flex-1 py-10 grid gap-6 md:grid-cols-3">
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign Room to This Device</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label htmlFor="assign">Room number</Label>
              <Input
                id="assign"
                value={assignRoom}
                onChange={(e) => setAssignRoom(e.target.value)}
                placeholder="e.g. 204"
              />
              <div className="flex gap-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!assignRoom) return;
                    localStorage.setItem("assignedRoom", assignRoom);
                    setAssignRoom("");
                  }}
                >
                  Assign
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    localStorage.removeItem("assignedRoom");
                    alert("Room assignment cleared.");
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={guestTab === "dashboard" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setGuestTab("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant={guestTab === "guests" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setGuestTab("guests")}
              >
                Guest Management
              </Button>
              <Button
                variant={guestTab === "requests" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setGuestTab("requests")}
              >
                Service Requests
              </Button>
            </CardContent>
          </Card>
        </aside>

        <section className="md:col-span-2 space-y-6">
          {guestTab === "dashboard" ? (
            <>
              <h1 className="text-3xl font-semibold tracking-tight">
                Admin Dashboard
              </h1>
              {isLoadingRequests || isLoadingGuests || isLoadingFeedback ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-lg font-medium">Loading dashboard data...</div>
                    <div className="text-sm text-muted-foreground mt-2">Please wait while we fetch your data</div>
                  </div>
                </div>
              ) : (
                <Dashboard 
                  guests={guests || []}
                  serviceRequests={serviceRequests || []}
                  feedbackData={feedbackData || []}
                />
              )}
            </>
          ) : guestTab === "requests" ? (
            <>
              <h1 className="text-3xl font-semibold tracking-tight">
                Service Requests
              </h1>
              <Card>
                <CardHeader>
                  <CardTitle>Latest</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingRequests ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : !serviceRequests || serviceRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No requests yet.
                    </p>
                  ) : (
                    <ul className="divide-y">
                      {serviceRequests.map((r) => (
                        <li key={r._id} className="py-3 flex items-start gap-4">
                          <div className="min-w-24 text-sm text-muted-foreground">
                            {format(new Date(r.createdAt), "PP p")}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium">
                                Room {r.roomNumber}
                              </span>
                              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                {r.guest?.name || 'Unknown Guest'}
                              </span>
                              <span className="text-xs rounded px-2 py-0.5 bg-muted text-foreground">
                                {r.status}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{r.request}</p>
                            <div className="mt-2 flex items-center gap-2">
                              {r.assignedTo ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    Assigned to: {r.assignedTo}
                                  </span>
                                  {r.status !== "completed" && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleComplete(r._id)}
                                    >
                                      Mark as Completed
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {assigningRequestId === r._id ? (
                                    <div className="space-y-2">
                                      <Select value={assignTo} onValueChange={setAssignTo}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select staff member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="waiter">Waiter</SelectItem>
                                          <SelectItem value="housekeeping">Housekeeping</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() => handleAssign(r._id)}
                                          disabled={!assignTo}
                                        >
                                          Assign
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={cancelAssign}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => startAssign(r._id)}
                                    >
                                      Assign Request
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="pt-2">
                    <Button variant="outline" onClick={() => refetchRequests()}>
                      Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : guestTab === "guests" ? (
            <>
              <h1 className="text-3xl font-semibold tracking-tight">
                Guest Management
              </h1>
              <Card>
                <CardHeader>
                  <CardTitle>Guest List</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingGuests ? (
                    <p className="text-sm text-muted-foreground">
                      Loading guests...
                    </p>
                  ) : !guests || guests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No guests found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Room
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Check-in
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Checkout
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {guests.map((guest) => (
                            <tr key={guest._id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {guest.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {guest.roomNumber}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Badge
                                  className={
                                    guest.status === "checked_in"
                                      ? "bg-green-100 text-green-800"
                                      : guest.status === "checked_out"
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {guest.status.replace("_", " ")}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {guest.checkInDate
                                  ? format(
                                      new Date(guest.checkInDate),
                                      "MM/dd/yyyy",
                                    )
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {guest.checkOutDate
                                  ? format(
                                      new Date(guest.checkOutDate),
                                      "MM/dd/yyyy",
                                    )
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {guest.status === "checked_in" && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `Checkout ${guest.name} from room ${guest.roomNumber}?`,
                                        )
                                      ) {
                                        handleCheckout(guest._id);
                                      }
                                    }}
                                  >
                                    Checkout
                                  </Button>
                                )}
                                {guest.status === "checked_out" && (
                                  <span className="text-gray-500">
                                    Checked out
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="pt-4">
                    <Button variant="outline" onClick={() => refetchGuests()}>
                      Refresh Guests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
