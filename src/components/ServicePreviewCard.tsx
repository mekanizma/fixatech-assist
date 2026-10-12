import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { ServiceIcon } from "@/components/ServiceIcon";

type Props = {
  slug: string;
  image: string;
  title: string;
  icon: string;
  response: string;
  short: string;
  detailLabel: string;
  index: number;
};

export function ServicePreviewCard({
  slug,
  image,
  title,
  icon,
  response,
  short,
  detailLabel,
  index,
}: Props) {
  return (
    <Link
      to="/hizmetler"
      hash={slug}
      className="service-preview-card group reveal"
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="service-preview-media">
        <img src={image} alt={title} loading="lazy" width={640} height={400} />
        <div className="service-preview-media-shade" />
        <div className="service-preview-icon" aria-hidden>
          <ServiceIcon name={icon} className="h-5 w-5" />
        </div>
      </div>

      <div className="service-preview-body">
        <div className="service-preview-meta">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{response}</span>
        </div>
        <h3 className="service-preview-title">{title}</h3>
        <p className="service-preview-desc">{short}</p>
        <span className="service-preview-cta">
          {detailLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
