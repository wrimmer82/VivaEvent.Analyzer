import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface CollaborationRequest {
  id: string;
  sender_id: string;
  service_description: string;
  personal_message: string | null;
  status: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
}

const CollaborationRequestsTable = () => {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("collaboration_requests")
        .select("*")
        .eq("receiver_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch sender details
      const requestsWithSenders = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profData } = await supabase
            .from("professionisti")
            .select("nome_completo, email")
            .eq("user_id", request.sender_id)
            .maybeSingle();

          return {
            ...request,
            sender_name: profData?.nome_completo || "Professionista",
            sender_email: profData?.email || "",
          };
        })
      );

      setRequests(requestsWithSenders);
    } catch (error) {
      console.error("Error loading collaboration requests:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le richieste",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    setProcessingId(requestId);
    
    try {
      const { error } = await supabase
        .from("collaboration_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: newStatus === "accepted" ? "Richiesta accettata" : "Richiesta rifiutata",
        description: `La richiesta è stata ${newStatus === "accepted" ? "accettata" : "rifiutata"} con successo`,
        className: newStatus === "accepted" ? "bg-green-500 text-white" : "",
      });

      await loadRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato della richiesta",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">In attesa</Badge>;
      case "accepted":
        return <Badge className="bg-green-500 text-white">Accettata</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rifiutata</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Nessuna richiesta di collaborazione ricevuta
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground py-2">Professionista</TableHead>
            <TableHead className="text-foreground py-2">Servizi</TableHead>
            <TableHead className="text-foreground py-2">Messaggio</TableHead>
            <TableHead className="text-foreground py-2">Stato</TableHead>
            <TableHead className="text-foreground py-2">Data</TableHead>
            <TableHead className="text-foreground py-2">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="text-foreground py-2">
                <div>
                  <div className="font-semibold text-sm">{request.sender_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {request.sender_email}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-foreground max-w-xs py-2">
                <div className="line-clamp-2 text-sm">{request.service_description}</div>
              </TableCell>
              <TableCell className="text-foreground max-w-xs py-2">
                {request.personal_message ? (
                  <div className="line-clamp-2 text-sm">{request.personal_message}</div>
                ) : (
                  <span className="text-muted-foreground italic text-xs">Nessun messaggio</span>
                )}
              </TableCell>
              <TableCell className="py-2">{getStatusBadge(request.status)}</TableCell>
              <TableCell className="text-foreground py-2 text-sm">
                {new Date(request.created_at).toLocaleDateString("it-IT")}
              </TableCell>
              <TableCell className="py-2">
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(request.id, "accepted")}
                      disabled={processingId === request.id}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(request.id, "rejected")}
                      disabled={processingId === request.id}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollaborationRequestsTable;
