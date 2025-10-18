import { motion } from "framer-motion";
import { Award, Clock, Users, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Desde 2020 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Desde 2020</h3>
                <p className="text-primary-foreground/90 text-sm">
                  Mais de 4 anos de excelência no atendimento odontológico, 
                  cuidando do sorriso de milhares de pacientes com dedicação e profissionalismo.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Prêmios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <Award className="w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Prêmios & EPAO</h3>
                <ul className="text-primary-foreground/90 text-sm space-y-2">
                  <li>• Prêmio Excelência 2022</li>
                  <li>• Top Clínicas SP 2023</li>
                  <li>• EPAO Certificado</li>
                  <li>• ISO 9001:2015</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Equipe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Nossos Doutores</h3>
                <p className="text-primary-foreground/90 text-sm space-y-1">
                  <strong>Proprietários:</strong><br />
                  Dr. Carlos Silva<br />
                  Dra. Ana Paula Santos<br />
                  <br />
                  <strong>E mais 8 especialistas</strong><br />
                  dedicados ao seu sorriso
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5" />
                <div>
                  <p>(11) 1234-5678</p>
                  <p>(11) 98765-4321</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5" />
                <p>contato@sorriaodonto.com.br</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5" />
                <p>
                  Av. Exemplo, 1234<br />
                  São Paulo - SP
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm"
        >
          <p className="text-primary-foreground/80">
            © {new Date().getFullYear()} Sorria Odonto. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
