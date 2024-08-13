import Image from "next/image";
import Link from "next/link";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const socials = [
  { icon: <FaYoutube />, href: "https://www.youtube.com" },
  { icon: <FaFacebook />, href: "https://www.facebook.com" },
  { icon: <FaInstagram />, href: "https://www.instagram.com" },
  { icon: <FaTwitter />, href: "https://www.twitter.com" },
];

const Footer = () => {
  return (
    <footer className="bg-primary py-[60px] lg:py-[120px]">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* logo */}
          <Link href={"/"}>
            <Image
              src={"/assets/logo-white.svg"}
              width={160}
              height={160}
              alt=""
            />
          </Link>
          <div className="flex gap-4">
            {socials.map((item, index) => {
              return (
                <Link
                  href={item.href}
                  key={index}
                  className="bg-accent text-white hover:bg-accent-hover text-lg 
                  w-[38px] h-[38px] flex items-center justify-center rounded-full transition-all"
                >
                  {item.icon}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
