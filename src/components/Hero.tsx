// src/components/Hero.tsx

import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="min-h-screen pt-20 bg-gradient-hero flex items-center justify-center">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Coluna da esquerda com o texto e botões (mantida) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
              Seu Sorriso,
              <span className="block text-primary">Nossa Missão</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              Há mais de 4 anos cuidando da saúde bucal com excelência, 
              tecnologia de ponta e profissionais especializados.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-semibold shadow-brand transition-all hover:scale-105">
                Agende sua Consulta
              </button>
              <button className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg font-semibold transition-all">
                Saiba Mais
              </button>
            </div>
          </motion.div>

          {/* Coluna da direita (espaço preservado mas vazio) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Este espaço está agora vazio e pronto para uso futuro */}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;