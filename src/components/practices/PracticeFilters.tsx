import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function PracticeFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-xl border">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher une pratique..." 
          className="pl-10"
        />
      </div>
      
      <Select>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Thème" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="connectivity">Connectivité</SelectItem>
          <SelectItem value="education">Éducation</SelectItem>
          <SelectItem value="health">E-Santé</SelectItem>
          <SelectItem value="agriculture">Agriculture</SelectItem>
          <SelectItem value="governance">Gouvernance</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Pays" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ci">🇨🇮 Côte d'Ivoire</SelectItem>
          <SelectItem value="sn">🇸🇳 Sénégal</SelectItem>
          <SelectItem value="cm">🇨🇲 Cameroun</SelectItem>
          <SelectItem value="ml">🇲🇱 Mali</SelectItem>
          <SelectItem value="bf">🇧🇫 Burkina Faso</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="project">Projet</SelectItem>
          <SelectItem value="policy">Politique</SelectItem>
          <SelectItem value="technology">Technologie</SelectItem>
          <SelectItem value="partnership">Partenariat</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
