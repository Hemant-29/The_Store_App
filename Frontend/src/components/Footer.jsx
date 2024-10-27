import fb_icon from "../assets/facebook.png";
import twitter_icon from "../assets/twitter.png";
import google_icon from "../assets/google.png";
import insta_icon from "../assets/insta.png";

function Footer(props) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="bg-neutral-100 w-full text-black">
        <div></div>
        <div className="text-center py-8 ">
          <p>Made with ❤️ in India</p>
          <p>All rights reserved: Hemant Bagaria</p>
        </div>

        <div className="flex items-center justify-between mx-10 py-6">
          <p>© {currentYear} Copyright: The Store App</p>

          <div className="flex gap-4">
            <a href="http://www.facebook.com" target="_blank">
              <img src={fb_icon} alt="facebook" width="25px" />
            </a>
            <a href="http://www.x.com" target="_blank">
              <img src={twitter_icon} alt="twitter" width="25px" />
            </a>
            <a href="http://www.google.com" target="_blank">
              <img src={google_icon} alt="google" width="25px" />
            </a>
            <a href="http://www.instagram.com" target="_blank">
              <img src={insta_icon} alt="instagram" width="25px" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
