import SpotlightHero from "@/components/spot-light";
import { Metadata } from "next";
import ContactForm from "./_components/ContactForm";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    path: "/contact",
    defaultTitle: "Contact",
    defaultDescription: "Get in touch with me for project inquiries, collaborations, freelance opportunities, or any questions. Full Stack Developer available for web development projects.",
  });
}

const ContactPage = async () => {

  return (
    <>
      <SpotlightHero
        pageName="Contact"
        pageDescription="Contact me for inquiries, collaborations, or any questions."
      />
      <ContactForm />
    </>
  );
}

export default ContactPage;
