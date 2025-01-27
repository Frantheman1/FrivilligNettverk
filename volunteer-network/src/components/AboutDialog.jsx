import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const AboutDialog = ({ isOpen, onClose }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      // Here you would typically send the message to your backend
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContactForm({ name: '', email: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[800px] max-h-[85vh] overflow-y-auto md:w-[85vw] md:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Om Frivillig Nettverk</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-gray-600">
          <p>
            Velkommen til Frivillig Nettverk - en plattform som kobler sammen frivillige med meningsfulle muligheter i lokalsamfunnet.
          </p>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Vår Misjon</h3>
            <p>
              Vi ønsker å gjøre det enklere for folk å finne og delta i frivillig arbeid, 
              samtidig som vi hjelper organisasjoner med å finne dedikerte frivillige.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Hvordan Det Fungerer</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">For Frivillige:</span> Bla gjennom muligheter, 
                søk på de som interesserer deg, og bli varslet når du blir godkjent.
              </li>
              <li>
                <span className="font-medium">For Organisasjoner:</span> Legg ut frivillige 
                muligheter, administrer søknader, og finn de rette frivillige for ditt prosjekt.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Våre Verdier</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fellesskap og samarbeid</li>
              <li>Tilgjengelighet og inkludering</li>
              <li>Engasjement og dedikasjon</li>
              <li>Åpenhet og ærlighet</li>
            </ul>
          </div>

          <p className="italic">
            Sammen kan vi gjøre en forskjell i vårt lokalsamfunn.
          </p>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Kontakt Oss</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#1a365d]">E-post:</span>
                <a 
                  href="mailto:kontakt@frivillig.nettverk" 
                  className="text-blue-600 hover:underline"
                >
                  frivillig.nettverk@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#1a365d]">Telefon:</span>
                <a 
                  href="tel:+4712345678" 
                  className="text-blue-600 hover:underline"
                >
                  +47 406 22 425
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Vi er tilgjengelige mandag til fredag, 09:00 - 17:00
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} Frivillig Nettverk. Alle rettigheter reservert.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog; 