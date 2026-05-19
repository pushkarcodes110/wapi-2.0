"use client";

import HomeImg from "@/public/assets/images/home.png";
import PlatformImg from "@/public/assets/images/platform.png";
import ProductLayout from "@/src/components/product/ProductLayout";
import ProductPageTemplate from "@/src/components/product/ProductPageTemplate";
import { ROUTES } from "@/src/constants";
import { Megaphone, Rocket, Users } from "lucide-react";

const BroadcastPage = () => {
  return (
    <ProductLayout>
      <ProductPageTemplate
        hero={{
          badge: "Wapi for Marketing",
          title: "Broadcast official WhatsApp messages to thousands at once",
          description: "Reach your entire customer base with 98% open rates. Send promotions, alerts, and updates safely through the official WhatsApp Business API.",
          primaryCTA: { text: "Manage Campaigns", link: ROUTES.MessageCampaigns },
          secondaryCTA: { text: "Book a Demo", link: "/dashbaord" },
          image: HomeImg,
        }}
        features={[
          {
            title: "High-Volume Official Messaging",
            description: "Send thousands of marketing messages safely. As an official partner, we ensure your broadcasts reach customers without the risk of account bans.",
            image: PlatformImg,
            imageAlt: "Mass Messaging UI",
          },
          {
            title: "Campaign Performance Analytics",
            description: "See exactly who opened and clicked your messages. Track engagement in real-time to measure the success of your outreach.",
            image: PlatformImg,
            imageAlt: "Analytics Dashboard",
          },
        ]}
        useCases={[
          {
            title: "Flash Sales",
            description: "Launch time-sensitive offers directly to customers where they are most active.",
            icon: <Megaphone className="w-10 h-10" />,
          },
          {
            title: "Product Launches",
            description: "Generate hype for new arrivals with interactive and rich-media broadcast campaigns.",
            icon: <Rocket className="w-10 h-10" />,
          },
          {
            title: "Order Notifications",
            description: "Keep customers informed with automated shipping and delivery alerts via WhatsApp.",
            icon: <Users className="w-10 h-10" />,
          },
        ]}
        finalCTA={{
          title: "Reach your customers instantly",
          description: "Wapi Broadcasts achieve up to 98% open rates compared to traditional email marketing.",
          buttonText: "Launch Sample Broadcast",
          buttonLink: "/register",
        }}
      />
    </ProductLayout>
  );
};

export default BroadcastPage;
