import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-[hsl(var(--nx-night))] text-white flex flex-col">
    <PublicHeader />
    <main className="container mx-auto px-4 py-12 max-w-3xl flex-1">
      <Button asChild variant="ghost" className="mb-8 text-white/60 hover:text-white">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Retour à l'accueil</Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
      <p className="text-white/50 text-sm mb-10">Dernière mise à jour : Février 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/80">
        <section>
          <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
          <p>La plateforme NEXUS, opérée par l'Union Africaine des Télécommunications (UAT) en partenariat avec l'ANSUT, s'engage à protéger la vie privée et les données personnelles de ses utilisateurs conformément aux réglementations internationales en vigueur.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Données collectées</h2>
          <p>Nous collectons les données suivantes lors de votre inscription et utilisation de la plateforme :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nom, prénom, adresse email</li>
            <li>Pays et organisation d'appartenance</li>
            <li>Données d'utilisation et de navigation (anonymisées)</li>
            <li>Contenus que vous publiez (documents, messages, projets)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>La gestion de votre compte utilisateur</li>
            <li>La personnalisation de votre expérience sur la plateforme</li>
            <li>La production de statistiques agrégées et anonymisées</li>
            <li>L'amélioration continue de nos services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Protection des données</h2>
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Chiffrement des données en transit (TLS/SSL) et au repos</li>
            <li>Contrôle d'accès basé sur les rôles (RBAC)</li>
            <li>Audits de sécurité réguliers</li>
            <li>Hébergement sécurisé conforme aux standards internationaux</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. Partage des données</h2>
          <p>Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec les organismes partenaires de l'UAT dans le cadre strict de la mission du réseau SUTEL, et avec votre consentement explicite.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">6. Vos droits</h2>
          <p>Vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Droit d'accès à vos données personnelles</li>
            <li>Droit de rectification et de mise à jour</li>
            <li>Droit de suppression de votre compte</li>
            <li>Droit à la portabilité de vos données</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">7. Contact</h2>
          <p>Pour toute question relative à la protection de vos données, contactez-nous à : <a href="mailto:secretariat@atu-uat.org" className="text-[hsl(var(--nx-gold))] hover:underline">secretariat@atu-uat.org</a></p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">8. Cookies et technologies</h2>
          <p>La plateforme NEXUS utilise des cookies et technologies similaires pour :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Maintenir votre session de connexion (cookies nécessaires)</li>
            <li>Mémoriser vos préférences linguistiques et d'affichage (cookies fonctionnels)</li>
            <li>Analyser l'utilisation de la plateforme de manière anonymisée (cookies analytiques)</li>
          </ul>
          <p className="mt-2">Lors de votre première visite, une bannière vous permet d'accepter ou de personnaliser vos choix en matière de cookies. Vous pouvez modifier vos préférences à tout moment depuis les paramètres de votre navigateur.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">9. Modération et sécurité</h2>
          <p>Afin de garantir un environnement sûr et respectueux pour tous les utilisateurs :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Les contenus publiés sont soumis à une modération active par l'équipe de l'UAT</li>
            <li>Un système de signalement permet aux utilisateurs de reporter tout contenu inapproprié</li>
            <li>Des audits de sécurité réguliers sont réalisés pour détecter et prévenir toute vulnérabilité</li>
            <li>Les comptes inactifs ou en infraction peuvent être suspendus conformément aux conditions d'utilisation</li>
          </ul>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
