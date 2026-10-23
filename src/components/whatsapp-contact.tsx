import { MessageCircle } from "lucide-react";

const number = "2348111690858";
const message = encodeURIComponent("Hello Prime Kare");

export function WhatsAppContact() {
  return <a className="whatsapp-float" href={`https://wa.me/${number}?text=${message}`} target="_blank" rel="noreferrer" aria-label="Message Prime Kare on WhatsApp">
    <MessageCircle size={21} aria-hidden="true" /><span>Chat with us</span>
  </a>;
}
