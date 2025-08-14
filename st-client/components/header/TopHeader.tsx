import React from "react";
import { FaInstagram } from "react-icons/fa";
import { SlSocialFacebook, SlSocialLinkedin } from "react-icons/sl";
import Container from "../Container";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import Currencies from "../Currencies";

const socialMedia = [
  {
    name: "facebook",
    link: process.env.FACEBOOK_LINK as string,
    icon: <SlSocialFacebook />,
  },
  {
    name: "instagram",
    link: process.env.INSTAGRAM_LINK as string,
    icon: <FaInstagram />,
  },
  {
    name: "linkedIn",
    link: process.env.LINKEDIN_LINK as string,
    icon: <SlSocialLinkedin />,
  },
  {
    name: "twitter",
    link: process.env.TWITTER_LINK as string,
    icon: <FaXTwitter />,
  },
];

const TopHeader = () => {
  return (
    <div className="bg-[#A96BDE] text-white">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={"/help"}
              className="text-sm font-medium text-white/90 hover:text-white duration-200 hover:underline"
            >
              Help Center
            </Link>
            <Link
              href={"/wishlist"}
              className="text-sm font-medium text-white/90 hover:text-white duration-200 hover:underline"
            >
              Wishlist
            </Link>
            <Link
              href={"/order"}
              className="text-sm font-medium text-white/90 hover:text-white duration-200 hover:underline"
            >
              Order Tracking
            </Link>
          </div>
          <div className=" hidden md:inline-flex">
            <p className="text-sm font-medium">
              100% Secure delivery without contacting the courier
            </p>
          </div>
          <div className=" hidden md:inline-flex items-center gap-4">
            <Currencies />
            <div className="flex items-center gap-4">
              {socialMedia?.map((item, index) => (
                <div key={index}>
                  <Link href={item?.link} target="_blank" className="text-base">
                    {item?.icon}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopHeader;
