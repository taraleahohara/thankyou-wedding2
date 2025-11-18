const FloralDecoration = ({ position = "top-right" }: { position?: "top-right" | "bottom-left" }) => {
  const positionClasses = {
    "top-right": "top-0 right-0 rotate-0",
    "bottom-left": "bottom-0 left-0 rotate-180"
  };

  return (
    <svg 
      className={`absolute ${positionClasses[position]} w-64 h-64 opacity-20 pointer-events-none`}
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cosmos flower petals */}
      <g stroke="currentColor" strokeWidth="1.5" className="text-wedding-rust">
        {/* Large flower */}
        <path d="M100 60 Q90 50 85 60 Q80 70 90 75 L100 80" />
        <path d="M100 60 Q110 50 115 60 Q120 70 110 75 L100 80" />
        <path d="M100 80 Q90 90 85 100 Q80 110 90 115 L100 120" />
        <path d="M100 80 Q110 90 115 100 Q120 110 110 115 L100 120" />
        <path d="M80 90 Q70 80 65 90 Q60 100 70 105 L80 110" />
        <path d="M120 90 Q130 80 135 90 Q140 100 130 105 L120 110" />
        <circle cx="100" cy="90" r="5" fill="currentColor" className="text-wedding-cream" />
        
        {/* Medium flower */}
        <path d="M150 100 Q145 95 142 100 Q140 105 145 108 L150 110" />
        <path d="M150 100 Q155 95 158 100 Q160 105 155 108 L150 110" />
        <path d="M150 110 Q145 115 142 120 Q140 125 145 128 L150 130" />
        <path d="M150 110 Q155 115 158 120 Q160 125 155 128 L150 130" />
        <circle cx="150" cy="115" r="3" fill="currentColor" className="text-wedding-cream" />
        
        {/* Small flower */}
        <path d="M170 140 Q168 137 166 140 Q164 143 168 145" />
        <path d="M170 140 Q172 137 174 140 Q176 143 172 145" />
        <circle cx="170" cy="142" r="2" fill="currentColor" className="text-wedding-cream" />
        
        {/* Stems */}
        <path d="M100 80 Q95 100 90 120" strokeWidth="1" />
        <path d="M150 110 Q148 125 145 140" strokeWidth="0.8" />
        <path d="M170 142 L168 160" strokeWidth="0.6" />
      </g>
    </svg>
  );
};

export default FloralDecoration;