import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { UserCircle, Star, Quote } from 'lucide-react';

const SuccessStories = ({ isOpen, onClose }) => {
  const [stories] = useState([
    {
      id: '1',
      title: 'En Meningsfull Sommer',
      story: 'Jeg brukte sommeren min på å hjelpe eldre med hagearbeid. Det var utrolig givende å se gleden i ansiktene deres når hagen ble forvandlet. Jeg lærte så mye om både hagearbeid og livshistorier fra disse fantastiske menneskene.',
      author: 'Emma Hansen',
      role: 'Frivillig',
      organization: 'Hjelp til Eldre',
      date: '2024-12-15',
      impact: '12 hager vedlikeholdt, 15 eldre hjulpet'
    },
    {
      id: '2',
      title: 'Kulturutveksling Gjennom Kunst',
      story: 'Som frivillig ved det lokale kunstgalleriet har jeg fått muligheten til å dele min lidenskap for kunst med barn fra ulike bakgrunner. Det er fantastisk å se hvordan kunst kan bygge broer mellom kulturer.',
      author: 'Sofia Berg',
      role: 'Kunstinstruktør',
      organization: 'Kunst for Alle',
      date: '2024-11-10',
      impact: '8 workshops holdt, 60 barn deltok'
    },
    {
      id: '3',
      title: 'Miljøvern i Praksis',
      story: 'Vår strandryddeaksjon samlet over 100 frivillige. Sammen klarte vi å rydde flere kilometer med strand og skape bevissthet om plastforurensning. Det var inspirerende å se lokalsamfunnet komme sammen for miljøet.',
      author: 'Lars Pedersen',
      role: 'Prosjektleder',
      organization: 'Rent Hav',
      date: '2024-11-05',
      impact: '500kg søppel samlet, 3km strand renset'
    }
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] max-w-[800px] h-[90vh] sm:h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="mb-4 sm:mb-6">
          <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a365d]" />
            Suksesshistorier
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <p className="text-sm sm:text-base text-gray-600">
            Inspirerende historier fra våre frivillige og organisasjoner
          </p>

          <div className="grid gap-4 sm:gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border space-y-3 sm:space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1a365d]">{story.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                      <UserCircle className="h-4 w-4" />
                      <span>{story.author}</span>
                      <span>•</span>
                      <span>{story.organization}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(story.date).toLocaleDateString('nb-NO')}
                  </div>
                </div>

                <div className="relative pl-5 sm:pl-6">
                  <Quote className="absolute left-0 top-0 h-4 w-4 text-[#1a365d] opacity-40" />
                  <p className="text-sm sm:text-base text-gray-700">{story.story}</p>
                </div>

                <div className="bg-blue-50 p-3 sm:p-4 rounded-md">
                  <div className="text-sm font-medium text-[#1a365d]">Påvirkning</div>
                  <div className="text-sm text-gray-700 mt-1">{story.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessStories; 