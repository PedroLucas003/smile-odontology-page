import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <motion.a
        href="https://wa.me/5511987654321"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-hover hover:shadow-brand transition-all"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={28} />
      </motion.a>

      <motion.a
        href="https://instagram.com/sorriaodonto"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-full flex items-center justify-center shadow-hover hover:shadow-brand transition-all"
        aria-label="Instagram"
      >
        <FaInstagram size={28} />
      </motion.a>
    </div>
  );
};

export default FloatingButtons;
