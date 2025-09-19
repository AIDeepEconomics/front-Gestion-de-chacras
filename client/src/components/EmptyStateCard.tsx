import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface EmptyStateCardProps {
  title: string;
  description: string;
}

export default function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-3 bg-muted rounded-full mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}