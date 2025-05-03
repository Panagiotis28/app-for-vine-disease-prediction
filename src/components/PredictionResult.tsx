
import { AlertTriangle, Check, Leaf } from "lucide-react";
import { PredictionResponse } from "../types";

interface PredictionResultProps {
  result: PredictionResponse | null;
  isLoading: boolean;
}

const PredictionResult = ({ result, isLoading }: PredictionResultProps) => {
  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const getResultStyle = () => {
    switch (result.prediction) {
      case "Healthy":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: <Check className="h-12 w-12 text-green-500" />,
          textColor: "text-green-800",
        };
      default:
        return {
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          icon: <AlertTriangle className="h-12 w-12 text-amber-500" />,
          textColor: "text-amber-800",
        };
    }
  };

  const style = getResultStyle();

  return (
    <div className={`mt-8 p-6 ${style.bgColor} rounded-lg border ${style.borderColor} text-center`}>
      <div className="flex flex-col items-center">
        {style.icon}
        <h3 className={`text-xl font-semibold mt-3 ${style.textColor}`}>
          {result.prediction === "Healthy" 
            ? "Your vine appears healthy!" 
            : `Detected: ${result.prediction}`}
        </h3>
        
        {result.confidence && (
          <p className="text-sm text-gray-600 mt-1">
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </p>
        )}
        
        {result.prediction !== "Healthy" && (
          <div className="mt-4 text-sm text-left max-w-md mx-auto">
            <h4 className="font-medium mb-1">Recommended actions:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Consider consulting a viticulture specialist</li>
              <li>Monitor the affected vines closely</li>
              <li>Check for spread to nearby plants</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionResult;
