"use client";

import Images from "@/src/shared/Image";
import { motion, AnimatePresence } from "framer-motion";

const LIGHT_LOGO = "/assets/logos/logo1.png";
const DARK_LOGO = "/assets/logos/sidebarLogo.png";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-white dark:bg-dark-body">
      <AnimatePresence>
        <motion.div
          animate={{ opacity: [0.72, 1, 0.72], scale: [0.98, 1, 0.98] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-56 items-center justify-center"
        >
          <Images src={LIGHT_LOGO} alt="Synqzy" width={224} height={80} className="block max-h-full max-w-full object-contain dark:hidden" unoptimized />
          <Images src={DARK_LOGO} alt="Synqzy" width={224} height={80} className="hidden max-h-full max-w-full object-contain dark:block" unoptimized />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Loading;
