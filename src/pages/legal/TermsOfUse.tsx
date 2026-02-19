import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";

const TermsOfUse = () => (
  <div className="min-h-screen bg-[hsl(var(--nx-night))] text-white flex flex-col">
    <PublicHeader />
    <main className="container mx-auto px-4 py-12 max-w-3xl flex-1">
      <Button asChild variant="ghost" className="mb-8 text-white/60 hover:text-white">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Retour à l'accueil</Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Conditions d'utilisation</h1>
      <p className="text-white/50 text-sm mb-10">Dernière mise à jour : Février 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/80">
        <section>
          <h2 className="text-xl font-semibold text-white">1. Objet</h2>
          <p>Les présentes conditions d'utilisation régissent l'accès et l'utilisation de la plateforme ADCA (UAT Digital Connect Africa), un réseau numérique panafricain dédié à la coordination des Fonds de Service Universel (FSU) des télécommunications, opéré sous l'égide de l'Union Africaine des Télécommunications (UAT).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Accès à la plateforme</h2>
          <p>L'accès à la plateforme est réservé aux représentants des organismes membres du réseau ADCA, aux partenaires institutionnels et aux personnes dûment autorisées. L'inscription requiert la fourniture d'informations exactes et vérifiables.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Obligations de l'utilisateur</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Fournir des informations exactes lors de l'inscription</li>
            <li>Maintenir la confidentialité de ses identifiants de connexion</li>
            <li>Utiliser la plateforme de manière conforme à sa mission institutionnelle</li>
            <li>Respecter les droits de propriété intellectuelle</li>
            <li>Ne pas publier de contenus contraires aux lois en vigueur</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Propriété intellectuelle</h2>
          <p>L'ensemble des contenus de la plateforme (textes, images, logos, logiciels) sont protégés par le droit de la propriété intellectuelle. Les documents partagés par les utilisateurs restent la propriété de leurs auteurs respectifs.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. Modération</h2>
          <p>L'UAT se réserve le droit de modérer les contenus publiés sur la plateforme et de suspendre tout compte ne respectant pas les présentes conditions d'utilisation.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">6. Limitation de responsabilité</h2>
          <p>L'UAT met tout en œuvre pour assurer la disponibilité de la plateforme mais ne saurait être tenue responsable des interruptions de service indépendantes de sa volonté. Les informations publiées par les utilisateurs n'engagent que leurs auteurs.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">7. Modification des conditions</h2>
          <p>L'UAT se réserve le droit de modifier les présentes conditions. Les utilisateurs seront notifiés de tout changement substantiel. La poursuite de l'utilisation de la plateforme vaut acceptation des conditions modifiées.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">8. Contact</h2>
          <p>Pour toute question : <a href="mailto:secretariat@atu-uat.org" className="text-[hsl(var(--nx-gold))] hover:underline">secretariat@atu-uat.org</a></p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">9. Sécurité des données</h2>
          <p>La plateforme ADCA met en œuvre des mesures techniques avancées pour protéger les données des utilisateurs :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Chiffrement de bout en bout des communications (TLS/SSL)</li>
            <li>Stockage sécurisé des données avec chiffrement au repos</li>
            <li>Contrôle d'accès basé sur les rôles (RBAC) pour limiter l'accès aux données sensibles</li>
            <li>Journalisation et audit des accès pour détecter toute activité suspecte</li>
            <li>Conformité aux standards internationaux de protection des données (RGPD, cadre UA)</li>
          </ul>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfUse;
