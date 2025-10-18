import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">
          Sorria Odonto
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Prontuário
          </Button>
          <Button className="bg-primary hover:bg-primary-hover shadow-brand">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
