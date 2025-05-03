
import { Leaf } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-700 to-green-900 py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-green-200" />
          <h1 className="text-2xl font-bold text-white">Vine Vision</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
