import React, { useEffect, useState } from "react";

export const RegisterModal = ({ isOpen, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    
    // Update layout mode on window resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    if (!isOpen) return null;

    
}

export default RegisterModal;