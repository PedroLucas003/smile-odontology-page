import { motion } from "framer-motion";
import DentistCard from "./DentistCard";
import { DentistProfile } from "@/types/dentist";

const teamMembers: DentistProfile[] = [
  {
    name: "Dr. Carlos Silva",
    cro: "12345-SP",
    specialties: ["Implantodontia", "Periodontia"],
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    isOwner: true,
  },
  {
    name: "Dra. Ana Paula Santos",
    cro: "23456-SP",
    specialties: ["Ortodontia", "DTM"],
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    isOwner: true,
  },
  {
    name: "Dr. Roberto Almeida",
    cro: "34567-SP",
    specialties: ["Endodontia", "Clínico Geral"],
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
  },
  {
    name: "Dra. Juliana Costa",
    cro: "45678-SP",
    specialties: ["Odontopediatria"],
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Fernando Lima",
    cro: "56789-SP",
    specialties: ["Cirurgia Bucomaxilofacial"],
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
  },
  {
    name: "Dra. Mariana Oliveira",
    cro: "67890-SP",
    specialties: ["Estética Dental", "Prótese"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Paulo Henrique",
    cro: "78901-SP",
    specialties: ["Implantodontia"],
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  },
  {
    name: "Dra. Beatriz Rocha",
    cro: "89012-SP",
    specialties: ["Ortodontia", "Harmonização Orofacial"],
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Gabriel Martins",
    cro: "90123-SP",
    specialties: ["Periodontia", "Clínico Geral"],
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
  {
    name: "Dra. Camila Ferreira",
    cro: "01234-SP",
    specialties: ["Endodontia", "Estética"],
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

const Team = () => {
  return (
    <section id="equipe" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossa Equipe
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Profissionais especializados e dedicados ao seu sorriso
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {teamMembers.map((dentist, index) => (
            <DentistCard key={dentist.cro} dentist={dentist} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
