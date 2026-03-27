import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "Page not found",
  openGraph: {
    title: "Page not found",
    description: "",
    url: "",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "Page Not Found",
      },
    ],
  },
};

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page not found</h1>
      <p>
        Sorry, the page you are looking for does not exist.
      </p>
      <div>
        <Link href="/">Go back home</Link>
      </div>
    </div>
  );
};

export default NotFound;