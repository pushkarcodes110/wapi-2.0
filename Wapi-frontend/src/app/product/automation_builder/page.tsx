"use client";

import HomeImg from "@/public/assets/images/landing1.png";
import PlatformImg from "@/public/assets/images/platform.png";
import ProductLayout from "@/src/components/product/ProductLayout";
import ProductPageTemplate from "@/src/components/product/ProductPageTemplate";
import { ROUTES } from "@/src/constants";
import { Bot, Cpu, Workflow } from "lucide-react";

const NoCodeChatbotPage = () => {
  return (
    <ProductLayout>
      <ProductPageTemplate
        hero={{
          badge: "Wapi for Automation",
          title: "Build smart WhatsApp chat flows without writing code",
          description:
            "Automate your customer interactions with a simple drag-and-drop builder. Create bots that answer FAQs, qualify leads, and route chats to your team instantly.",
          primaryCTA: {
            text: "Manage Automation Builder",
            link: ROUTES.BotFlow,
          },
          secondaryCTA: { text: "Book a Demo", link: ROUTES.Dashboard },
          image: HomeImg,
        }}
        features={[
          {
            title: "Design visual conversations",
            description:
              "Use our intuitive drag-and-drop interface to build complex bot logic without a single line of code. Map out every customer path with ease.",
            image: PlatformImg,
            imageAlt: "Automation Builder UI",
          },
          {
            title: "Smart Keyword & Menu Triggers",
            description:
              "Listen for specific customer keywords or provide interactive menus. Respond instantly with the right flow at exactly the right time.",
            image: PlatformImg,
            imageAlt: "Logic Builder UI",
          },
        ]}
        useCases={[
          {
            title: "Sales Automation",
            description:
              "Qualify leads and book meetings automatically. Scale your sales pipeline without increasing headcount.",
            icon: <Bot className="w-10 h-10" />,
          },
          {
            title: "Customer Support",
            description:
              "Deflect up to 70% of common queries. Provide instant answers to FAQs even during weekends and holidays.",
            icon: <Workflow className="w-10 h-10" />,
          },
          {
            title: "Feedback & Surveys",
            description:
              "Gamify data collection. Capture customer feedback and insights through interactive chat experiences.",
            icon: <Cpu className="w-10 h-10" />,
          },
        ]}
        finalCTA={{
          title: "Build your first bot in minutes",
          description:
            "Experience the power of the world's most intuitive no-code WhatsApp flow builder.",
          buttonText: "Start Building for Free",
          buttonLink: "/register",
        }}
      />
    </ProductLayout>
  );
};

export default NoCodeChatbotPage;
