"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";
import { CategorySection } from "@/components/home/CategorySection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { FaqSection } from "@/components/home/FaqSection";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Animated Hero / Banner Section */}
      <HeroBanner />

      {/* 2. Featured Equipment Section (6 Items Limit with Auth-Aware Details) */}
      <FeaturedEquipment />

      {/* 3. Equipment Categories Grid (6 Core Sectors with Direct Filter Navigation) */}
      <CategorySection />

      {/* 4. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 5. Extra Section 1: How It Works (3-Step Rental Process) */}
      <HowItWorks />

      {/* 6. Customer Reviews & Social Proof */}
      <CustomerReviews />

      {/* 7. Extra Section 2: Frequently Asked Questions (FAQ) */}
      <FaqSection />
    </div>
  );
}
