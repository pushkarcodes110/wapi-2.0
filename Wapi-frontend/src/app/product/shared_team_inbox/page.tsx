"use client";

import HomeImg from "@/public/assets/images/home.png";
import PlatformImg from "@/public/assets/images/platform.png";
import ProductLayout from "@/src/components/product/ProductLayout";
import ProductPageTemplate from "@/src/components/product/ProductPageTemplate";
import { ROUTES } from "@/src/constants";
import { Inbox, LayoutGrid, Shield } from "lucide-react";

const SharedInboxPage = () => {
  return (
    <ProductLayout>
      <ProductPageTemplate
        hero={{
          badge: "Wapi for Service",
          title: "One Shared WhatsApp Inbox for your entire team",
          description: "Stop sharing physical phones. Centralize all WhatsApp chats in one dashboard where your team can collaborate, assign chats, and respond faster.",
          primaryCTA: { text: "Make Your Chat", link: ROUTES.WAChat },
          secondaryCTA: { text: "Book a Demo", link: ROUTES.Dashboard },
          image: HomeImg,
        }}
        features={[
          {
            title: "Smart Agent Assignment",
            description: "Automatically or manually route conversations to the right team member. Ensure every query is handled by the best person for the job.",
            image: PlatformImg,
            imageAlt: "Inbox Dashboard",
          },
          {
            title: "Internal Notes & Chat Mentions",
            description: "Collaborate on tricky questions without the customer ever seeing. Tag teammates and leave private notes directly in the chat window.",
            image: PlatformImg,
            imageAlt: "Collaboration UI",
          },
        ]}
        useCases={[
          {
            title: "Customer Success",
            description: "Provide a seamless support experience with shared access and continuity across agent shifts.",
            icon: <Inbox className="w-10 h-10" />,
          },
          {
            title: "Team Accountability",
            description: "Monitor individual agent performance and overall team efficiency with deep analytics.",
            icon: <Shield className="w-10 h-10" />,
          },
          {
            title: "Data Security",
            description: "Control access with granular permissions. Ensure sensitive customer information is handled securely.",
            icon: <LayoutGrid className="w-10 h-10" />,
          },
        ]}
        finalCTA={{
          title: "Bring your team together",
          description: "Join over 5,000 teams using Wapi to optimize their WhatsApp customer operations.",
          buttonText: "Create Team Inbox",
          buttonLink: "/register",
        }}
      />
    </ProductLayout>
  );
};

export default SharedInboxPage;
