import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

interface GuestInfoProps {
  guestData: GuestData;
  onCheckout?: () => void;
}

const GuestInfo = ({ guestData, onCheckout }: GuestInfoProps) => {
  // Add a guard clause here. If guestData is not yet loaded, render nothing.
  if (!guestData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    // Also add a check here for safety, in case the date is missing.
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked_in":
        return "bg-green-100 text-green-800";
      case "checked_out":
        return "bg-gray-100 text-gray-800";
      case "reserved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Guest Information
          </CardTitle>
          <Badge className={getStatusColor(guestData.status)}>
            {guestData.status ? guestData.status.replace("_", " ").toUpperCase() : 'N/A'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Guest Name</h4>
              <p className="font-semibold">
                {guestData.name}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email
              </h4>
              <p>{guestData.email}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Phone
              </h4>
              <p>{guestData.phone}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Room Number
              </h4>
              <p className="text-2xl font-bold text-primary">
                {guestData.roomNumber}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Check-in Date
              </h4>
              <p>{formatDate(guestData.checkInDate)}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Check-out Date
              </h4>
              <p>{formatDate(guestData.checkOutDate)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      {guestData.status === 'checked_in' && onCheckout && (
        <CardFooter className="pt-4">
          <Button 
            variant="destructive" 
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              if (confirm(`Checkout ${guestData.name} from room ${guestData.roomNumber}?`)) {
                onCheckout();
              }
            }}
          >
            Checkout Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GuestInfo;
