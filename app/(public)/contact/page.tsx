import SpotlightHero from "@/components/spot-light";
import { Metadata } from "next";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
};

const ContactPage = async () => {

  return (
    <>
      <SpotlightHero
        pageName="Contact"
        pageDescription="Contact me for inquiries, collaborations, or any questions."
      />
      <ContactForm  />
    </>
  );
}

export default ContactPage;
