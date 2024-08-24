'use client';

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAllContactsAction } from "@/actions/contact.actions";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { sendEmail } from '@/utils/send-mail';
import { FaPhoneAlt } from "react-icons/fa";
import { IoClose, IoMail } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

export type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactForm = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { data } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getAllContactsAction(),
  });

  const contact = data?.contacts[0]; // Use optional chaining to safely access contacts

  useEffect(() => {
    if (successMessage) {
      let intervalId: NodeJS.Timeout;
      const timer = setTimeout(() => setSuccessMessage(null), 5000);

      let startTime = Date.now();
      intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progressPercent = Math.min((elapsedTime / 5000) * 100, 100);
        setProgress(progressPercent);
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(intervalId);
      };
    }
  }, [successMessage]);

  async function onSubmit(formData: FormData) {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setProgress(0);

    try {
      await sendEmail(formData);
      setSuccessMessage("Email sent. Thank you for your message.");
      reset();
    } catch (error) {
      setErrorMessage("Failed to send email. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!data || data.contacts.length === 0) return <h1 className="text-center">Add Contact details first!</h1>;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 w-full max-w-6xl mx-auto">
      <div className="w-full md:w-2xl space-y-8 mr-8">
        {successMessage && (
          <div className="relative p-4 mb-4 text-green-800 bg-green-200 rounded">
            <button
              className="absolute top-2 right-2 text-green-800 font-bold"
              onClick={() => setSuccessMessage(null)}
            >
              <IoClose />
            </button>
            {successMessage}
            <div className="h-1 mt-2 bg-green-400" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }} />
          </div>
        )}
        {errorMessage && (
          <div className="p-4 mb-4 text-red-800 bg-red-200 rounded">
            {errorMessage}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" {...register('name', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your email" type="email" {...register('email', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Enter the subject" {...register('subject', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Enter your message" className="min-h-[100px]" {...register('message', { required: true })} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      </div>

      {/* Right Side */}
      <div className="hidden md:block relative">
        <div className="absolute inset-0 flex items-center justify-center mr-60">
          <div className="border-l-2 border-gray h-60"></div>
        </div>
      </div>
      <div className="hidden md:block w-full md:w-2/3 ml-8 space-y-6">
        <div>
          <h3 className="font-bold text-lg">Contact Information</h3>
          <p>Feel free to reach out to us through any of the following methods</p>
        </div>
        {contact ? (
          <>
            <div className="space-y-2 flex items-center">
              <MdLocationPin className="w-6 h-6 text-white mr-4 mb-4" />
              <div>
                <h4 className="font-semibold">Address</h4>
                <p>{contact?.address}</p>
              </div>
            </div>
            <div className="space-y-2 flex items-center">
              <IoMail className="w-6 h-6 text-white mr-4 mb-4" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p>{contact?.email}</p>
              </div>
            </div>
            <div className="space-y-2 flex items-center">
              <FaPhoneAlt className="w-6 h-6 text-white mr-4 mb-4" />
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p>{contact?.phone}</p>
              </div>
            </div>
          </>
        ) : (
          <p>No contact information available.</p>
        )}
      </div>
    </div>
  );
}

export default ContactForm;
