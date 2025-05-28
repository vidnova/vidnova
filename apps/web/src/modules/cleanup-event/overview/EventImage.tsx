import { useState } from 'react';
import { Expand } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@ecorally/ui';

export const EventImage = ({ imageUrl }: { imageUrl: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative">
        <img
          src={imageUrl}
          className="w-full h-[500px] object-cover rounded-t-2xl"
          alt="Event image"
        />
        <DialogTrigger asChild>
          <button
            className="bg-white absolute right-6 bottom-6 p-2 rounded-full cursor-pointer backdrop-blur-2xl opacity-60 hover:opacity-70 transition-opacity"
            onClick={() => setOpen(true)}
          >
            <Expand />
          </button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <img src={imageUrl} alt="Full size event image" className="w-full h-full object-contain" />
      </DialogContent>
    </Dialog>
  );
};
