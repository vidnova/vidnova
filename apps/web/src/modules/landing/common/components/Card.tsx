interface CardProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
  description: string;
}

export const Card = ({ title, description, className, ...rest }: CardProps) => {
  return (
    <div className={`bg-[#1f1f1f] p-6 rounded-xl ${className ?? ''}`} {...rest}>
      <h4 className="text-xl font-semibold mb-3 text-white">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};
