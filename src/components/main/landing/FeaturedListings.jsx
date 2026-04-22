import React from "react";
import ListingCard from "../../ListingCard.jsx";

export default function FeaturedListings() {
    const listings = [
    {
      title: "NVIDIA RTX 4090 Founders Edition",
      price: "R28,500",
      seller: "Maxwell Chen",
      location: "Gauteng",
      status: "Available Now",
      condition: "Like New",
      image: "https://placehold.co/600x400/2e1065/ffffff?text=RTX+4090"
    },
    {
      title: "AMD Ryzen 9 7950X3D Processor",
      price: "R9,200",
      seller: "Sarah van der Berg",
      location: "Western Cape",
      status: "Offer Received",
      condition: "New",
      image: "https://placehold.co/600x400/2e1065/ffffff?text=Ryzen+9"
    },
    {
      title: "Samsung 990 PRO 4TB NVMe Gen4",
      price: "R7,200",
      seller: "Amara Okonkwo",
      location: "KwaZulu-Natal",
      status: "Payment Pending",
      condition: "New",
      image: "https://placehold.co/600x400/2e1065/ffffff?text=Samsung+990"
    },
    {
      title: "Intel Core i9-14900K Raptor Lake",
      price: "R8,800",
      seller: "Sarah van der Berg",
      location: "Western Cape",
      status: "Available Now",
      condition: "New",
      image: "https://placehold.co/600x400/2e1065/ffffff?text=i9-14900K"
    }
  ];

  return (
    <section className="w-full bg-neutral-100 py-12 px-4">
        <div className="max-w-[1440px] mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-purple-600 text-3xl font-black uppercase tracking-tighter">
                    Featured Listings
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                    Hand-picked premium hardware deals in your area
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {listings.map((item, index) => (
                    <ListingCard key={index} {...item} />
                ))}
            </div>
        </div>
    </section>
  )
}