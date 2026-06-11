import { useT } from "@/lib/i18n";

import acImg from "@/assets/service-ac.png";
import kitchenImg from "@/assets/service-kitchen.jpg";
import electricImg from "@/assets/service-electric.jpg";
import plumbingImg from "@/assets/service-plumbing.jpg";
import renovationImg from "@/assets/service-renovation.jpg";

export const services = [
  {
    slug: "klima-beyaz-esya",
    title: "Klima ve Beyaz Eşya Bakım & Onarım",
    icon: "AirVent",
    image: acImg,
    short: "Split klima, VRF, buzdolabı, çamaşır ve bulaşık makinesi tamir ile periyodik bakım.",
    description:
      "KKTC'de otel, restoran ve işletmelerde klima montajı, gaz dolumu, filtre ve periyodik bakım; buzdolabı, çamaşır makinesi, kurutma makinesi ve ankastre cihazlarda arıza tespiti, onarım ve garantili servis sunuyoruz.",
    features: [
      "Split & VRF klima servisi",
      "Gaz dolumu ve periyodik bakım",
      "Buzdolabı & derin dondurucu",
      "Çamaşır & kurutma makinesi",
      "Ankastre ve bulaşık makinesi",
    ],
    response: "1-2 saat içinde",
  },
  {
    slug: "endustriyel-mutfak",
    title: "Endüstriyel Mutfak Ekipmanları",
    icon: "ChefHat",
    image: kitchenImg,
    short: "Fırın, ocak, bulaşık makinesi ve soğutma sistemlerinde uzman tamir ve bakım hizmeti.",
    description:
      "Konveksiyonlu fırın, gazlı ocak, salamander, bulaşık makinesi, buzdolabı ve soğuk oda gibi tüm endüstriyel mutfak ekipmanlarının kurulum, bakım ve onarımını tek elden gerçekleştiriyoruz.",
    features: ["Konveksiyonlu fırın bakımı", "Bulaşık makinesi servisi", "Soğutma sistemi onarımı", "Gaz hattı kontrolü", "Salamander & ocak tamiri"],
    response: "2 saat içinde",
  },
  {
    slug: "elektrik-tesisati",
    title: "Elektrik Tesisatı",
    icon: "Zap",
    image: electricImg,
    short: "Arıza tespiti, yeni kurulum ve periyodik bakım — sertifikalı ustalar ile.",
    description:
      "Sigorta panosu, aydınlatma, topraklama, kompanzasyon ve yüksek akım hatlarında profesyonel kurulum, arıza giderme ve yıllık bakım sözleşmeleri sunuyoruz.",
    features: ["Pano & sigorta sistemleri", "Aydınlatma kurulumu", "Topraklama ölçümü", "Kompanzasyon", "Acil arıza müdahale"],
    response: "1 saat içinde",
  },
  {
    slug: "su-tesisati",
    title: "Su Tesisatı",
    icon: "Droplets",
    image: plumbingImg,
    short: "Su kaçağı tespiti, tıkanıklık açma ve altyapı onarımında modern ekipman.",
    description:
      "Robotik kamera ile tahribatsız kaçak tespiti, basınç testleri, sıcak/soğuk su hattı onarımı, pis su giderleri ve pompa sistemlerinde tam çözüm.",
    features: ["Tahribatsız kaçak tespiti", "Tıkanıklık açma", "Pompa & hidrofor", "Boyler bakımı", "Drenaj sistemleri"],
    response: "2 saat içinde",
  },
  {
    slug: "tadilat-tamirat",
    title: "Genel Tadilat ve Tamirat",
    icon: "Hammer",
    image: renovationImg,
    short: "Otel ve restoran renovasyonunda anahtar teslim profesyonel projeler.",
    description:
      "Mutfak yenileme, salon tadilatı, alçıpan, boya, fayans, ahşap işleri ve özel mobilya projelerinde tasarımdan teslime kadar süreç yönetimi.",
    features: ["Mutfak renovasyon", "Salon tadilat", "Alçıpan & boya", "Fayans & seramik", "Özel mobilya"],
    response: "Proje bazlı",
  },
  {
    slug: "acil-servis",
    title: "Acil Teknik Servis 7/24",
    icon: "Siren",
    image: kitchenImg,
    short: "Gece-gündüz fark etmeden, kritik arızalarda hızlı saha müdahalesi.",
    description:
      "Otel ve restoranlarda iş sürekliliğini koruyan 7/24 acil teknik servis. Telefonla bildirim sonrası en kısa sürede sahada profesyonel ekip.",
    features: ["7/24 hatlar açık", "Mobil servis araçları", "Yedek parça stoğu", "Garanti kapsamı", "Anlık raporlama"],
    response: "30-60 dk",
  },
] as const;

export type Service = (typeof services)[number];

export function useLocalizedServices() {
  const t = useT();
  const data = t.services_data as Array<{
    title: string;
    short: string;
    description: string;
    features: string[];
    response: string;
  }>;
  return services.map((s, i) => ({
    slug: s.slug,
    icon: s.icon,
    image: s.image,
    title: data[i]?.title ?? s.title,
    short: data[i]?.short ?? s.short,
    description: data[i]?.description ?? s.description,
    features: (data[i]?.features ?? s.features) as readonly string[],
    response: data[i]?.response ?? s.response,
  }));
}
