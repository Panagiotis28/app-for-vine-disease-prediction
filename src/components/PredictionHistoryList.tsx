
import { AlertTriangle, Check } from "lucide-react";
import { PredictionHistory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface PredictionHistoryListProps {
  history: PredictionHistory[];
  isLoading: boolean;
}

const PredictionHistoryList = ({ history, isLoading }: PredictionHistoryListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-16 w-16 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No prediction history available.</p>
        <p className="text-gray-400 text-sm mt-2">Upload and analyze images to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-xl font-semibold text-center mb-6">Recent Predictions</h2>
      
      {history.map((item) => {
        const isHealthy = item.prediction === "Healthy";
        const confidence = item.confidence ? Math.round(item.confidence * 100) : null;
        
        return (
          <div 
            key={item.id} 
            className={`flex items-start gap-4 p-4 border rounded-lg ${
              isHealthy ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
            }`}
          >
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={`Vine leaf - ${item.prediction}`}
                className="h-16 w-16 rounded object-cover border"
              />
            ) : (
              <div className="h-16 w-16 rounded bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isHealthy ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <h3 className="font-semibold">
                  {isHealthy ? "Healthy" : `Detected: ${item.prediction}`}
                </h3>
              </div>
              
              {confidence !== null && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Confidence</span>
                    <span>{confidence}%</span>
                  </div>
                  <Progress value={confidence} className="h-1.5" />
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2">
                {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PredictionHistoryList;
