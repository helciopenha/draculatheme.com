"use client";

import Image from "next/image";
import Markdown from "src/components/markdown";
import { fadeInUp } from "src/lib/framerMotion";
import { motion } from "framer-motion";

const Main = ({ theme, markdown }) => {
  return (
    <>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="preview"
      >
        <Image
          src={`https://raw.githubusercontent.com/dracula/${theme}/master/screenshot.png`}
          alt={`${theme} - Theme Preview`}
          quality={100}
          width={500}
          height={500}
        />
      </motion.div>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="instructions"
      >
        <Markdown markdown={markdown}></Markdown>
      </motion.div>
    </>
  );
};

export default Main;
