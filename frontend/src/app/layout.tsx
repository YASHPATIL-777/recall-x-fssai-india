import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RECALL//X — Product Recall Intelligence",
  description:
    "RECALL//X is a product recall intelligence console powered by Kafka, PySpark, PostgreSQL, Airflow, FastAPI and Next.js.",
  keywords: [
    "RECALL//X",
    "Product Recall Console",
    "Data Engineering",
    "Kafka",
    "PySpark",
    "PostgreSQL",
    "Airflow",
    "FastAPI",
    "Next.js",
    "RappelConso API",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
