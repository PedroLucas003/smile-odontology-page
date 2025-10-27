import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // 1. Importe o componente Link

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* 2. Envolva o logo com Link para a página inicial */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Sorria Odonto
        </Link>
        
        <div className="flex items-center gap-3">
          {/* 3. Envolva o botão Prontuário com Link */}
          <Link to="/prontuario">
            <Button 
              variant="outline" 
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Prontuário
            </Button>
          </Link>
          
          {/* 4. Envolva o botão Login com Link */}
          <Link to="/login">
            <Button className="bg-primary hover:bg-primary-hover shadow-brand">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;