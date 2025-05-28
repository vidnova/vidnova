import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Shovel } from "lucide-react";
import { useState } from "react";

type Instrument = {
  id: string;
  name: string;
};

const instruments: Instrument[] = [
  { id: "1", name: "Інструмент 1" },
  { id: "2", name: "Інструмент 2" },
  { id: "3", name: "Інструмент 3" },
];

export const InstrumentDialog = () => {
  const [selected, setSelected] = useState<Record<string, number>>({});

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      id in prev
        ? Object.fromEntries(Object.entries(prev).filter(([key]) => key !== id))
        : { ...prev, [id]: 1 }
    );
  };

  const handleQuantityChange = (id: string, value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setSelected((prev) => ({ ...prev, [id]: num }));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Shovel />
          <span>Обрати інструменти</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Оберіть інструменти</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Оберіть інструменти, які учасники мають з собою мати.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {instruments.map((instrument) => (
            <div
              key={instrument.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={instrument.id}
                  checked={instrument.id in selected}
                  onCheckedChange={() => handleToggle(instrument.id)}
                />
                <Label htmlFor={instrument.id}>{instrument.name}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground text-sm">Кільк.</span>
                <Input
                  type="number"
                  min={1}
                  disabled={!selected[instrument.id]}
                  value={selected[instrument.id] ?? ""}
                  onChange={(e) =>
                    handleQuantityChange(instrument.id, e.target.value)
                  }
                  className="w-16"
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
