import React from "react";
import { motion } from "framer-motion";
import Hero from "../../components/main/about/Hero";
import Stats from "../../components/main/about/Stats";
import Content from "../../components/main/about/Content";
import Pillars from "../../components/main/about/Pillars";

export default function About() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col w-full"
        >
            <Hero />
            <Stats />
            <Content />
            <Pillars />
        </motion.div>
    );
}