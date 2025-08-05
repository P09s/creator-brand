function Footer() {

    if (location.pathname === '/org_dashboard' || location.pathname === '/influencer_dashboard') {
        return null;
      }
    return (
        <footer className="bottom-0 left-0 w-full bg-black text-gray-400 justify-bottom items-center flex flex-col py-4">
            <span>@ 2025 LinkFluence, All rights reserved.</span>
        </footer>
    );
}
export default Footer;