import type { Metadata } from "next";
import EarnLandingClient from "./EarnLandingClient";

export const metadata: Metadata = {
  title: "Gana Gratis | AlphaTrade Capital",
  description: "Descubre cómo ganar USDT gratis viendo anuncios cortos patrocinados. Sin inversión inicial necesaria.",
};

export default function Page() {
  return <EarnLandingClient />;
}
