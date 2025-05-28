export const InstrumentsList = () => {
  return (
    <div>
      <span className="text-xl font-bold text-accent">Мати з собою</span>
      <ul className="list-disc pl-5 mt-3 text-accent">
        <div className="flex gap-3">
          <li className="text-accent">Мішки для сміття</li>
          <span className="text-muted-foreground">3 шт.</span>
        </div>
        <div className="flex gap-3">
          <li className="text-accent">Рукавички</li>
          <span className="text-muted-foreground">1 шт.</span>
        </div>
        <div className="flex gap-3">
          <li className="text-accent">Лопата</li>
          <span className="text-muted-foreground">1 шт.</span>
        </div>
        <div className="flex gap-3">
          <li className="text-accent">Граблі</li>
          <span className="text-muted-foreground">1 шт.</span>
        </div>
      </ul>
    </div>
  );
};
