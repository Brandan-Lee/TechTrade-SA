import React from "react";
import FeaturedListings from '../../components/main/landing/FeaturedListings';
import TrustedSeller from '../../components/main/landing/TrustedSeller';


export default function Home() {
    return (
        <>
            <TrustedSeller />
            <FeaturedListings />
        </>
    )
}