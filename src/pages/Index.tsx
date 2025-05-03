
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Leaf } from "lucide-react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import PredictionResult from "@/components/PredictionResult";
import PredictionHistoryList from "@/components/PredictionHistoryList";
import { uploadImage, getPredictionHistory } from "@/services/api";
import { PredictionResponse } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const { toast } = useToast();

  // Fetch prediction history
  const { data: historyData, isLoading: isHistoryLoading, refetch: refetchHistory } = useQuery({
    queryKey: ['predictionHistory'],
    queryFn: getPredictionHistory,
  });

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const response = await uploadImage(selectedFile);
      setResult(response);
      // Refetch history after a successful prediction
      refetchHistory();
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "There was a problem analyzing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white p-6 shadow-md">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span>Upload Image</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Prediction History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Vine Disease Detection</h2>
                <p className="mt-2 text-gray-600">
                  Upload an image of a vine leaf to detect potential diseases using AI
                </p>
              </div>

              <Separator />

              <div className="mx-auto max-w-md">
                <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!selectedFile || isLoading} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Analyzing..." : "Analyze Image"}
                </Button>
              </div>

              <PredictionResult result={result} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="history">
              <PredictionHistoryList history={historyData || []} isLoading={isHistoryLoading} />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default Index;
