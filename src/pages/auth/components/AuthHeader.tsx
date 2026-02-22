import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NexusLogo } from '@/components/shared/NexusLogo';

export const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l'accueil
      </Link>
      
      <div className="flex items-center justify-center mb-6">
        <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-border">
          <NexusLogo size="lg" variant="icon" animated={false} />
        </div>
      </div>
      
      <h1 className="text-4xl font-black text-white mb-2 font-poppins tracking-tight">
        UDC
      </h1>
      <p className="text-white/90 font-medium text-lg font-inter">
        Connecter l'écosystème numérique de l'Afrique
      </p>
      <p className="text-white/70 text-sm mt-2 font-inter tracking-wide">
        UAT • ANSUT • Universal Digital Connect
      </p>
    </div>
  );
};
