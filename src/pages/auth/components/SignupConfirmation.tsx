import { CheckCircle, Mail } from "lucide-react";

interface SignupConfirmationProps {
  firstName: string;
  lastName: string;
  country: string;
  organization: string;
}

export const SignupConfirmation = ({
  firstName,
  lastName,
  country,
  organization,
}: SignupConfirmationProps) => {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-emerald-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Inscription réussie !</h2>
        <p className="text-muted-foreground">
          Votre compte a été créé avec succès.
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-5 space-y-3 text-left">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Nom complet</p>
          <p className="font-medium text-foreground">{firstName} {lastName}</p>
        </div>
        {country && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Pays</p>
            <p className="font-medium text-foreground">{country}</p>
          </div>
        )}
        {organization && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Organisation</p>
            <p className="font-medium text-foreground">{organization}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 bg-blue-500/10 text-blue-700 rounded-lg p-4 text-sm">
        <Mail className="h-5 w-5 shrink-0" />
        <p>Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception pour activer votre compte.</p>
      </div>
    </div>
  );
};
