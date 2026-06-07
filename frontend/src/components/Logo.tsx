interface LogoProps {
  className?: string;
  fontSize?: string;
  textColor?: string;
}

const Logo = ({
  className = '',
  fontSize = 'text-2xl',
  textColor = 'text-slate-900 dark:text-white'
}: LogoProps) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Styled Brand Typography with 'off' highlighted in purple */}
      <span className={`font-sans font-black tracking-tight ${fontSize} ${textColor}`}>
        show<span className="text-primary">off</span>
      </span>
    </div>
  );
};

export default Logo;
