import SpotlightHero from "@/components/spot-light";
import { Metadata } from "next";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out to me for inquiries, collaborations, or any questions. I'm always open to new opportunities and discussions. Feel free to contact me through the form below or through my social media links."
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
