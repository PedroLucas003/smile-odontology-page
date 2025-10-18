import { motion } from "framer-motion";
import { DentistProfile } from "@/types/dentist";
import { cn } from "@/lib/utils";

interface DentistCardProps {
  dentist: DentistProfile;
  index: number;
}

const DentistCard = ({ dentist, index }: DentistCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all",
        dentist.isOwner && "border-4 border-primary"
      )}
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={dentist.imageUrl}
          alt={dentist.name}
          className="w-full h-full object-cover transition-transform hover:scale-110"
        />
      </div>
      
      <div className="p-6 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-foreground">{dentist.name}</h3>
          {dentist.isOwner && (
            <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
              Proprietário
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground font-medium">
          CRO: {dentist.cro}
        </p>
        
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Especialidades:
          </p>
          <div className="flex flex-wrap gap-2">
            {dentist.specialties.map((specialty, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DentistCard;
