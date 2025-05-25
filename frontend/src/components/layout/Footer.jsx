import { FaLock, FaShieldAlt, FaUserSecret } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-graphene text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Privacy Features */}
          <div>
            <h3 className="text-xl font-bold mb-4">Privacy Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaUserSecret className="mr-2 text-primary" />
                Enhanced Privacy Protection
              </li>
              <li className="flex items-center">
                <FaShieldAlt className="mr-2 text-primary" />
                Security Hardening
              </li>
              <li className="flex items-center">
                <FaLock className="mr-2 text-primary" />
                No Google Services
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-primary-light">About GrapheneOS</a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-primary-light">Shipping Information</a>
              </li>
              <li>
                <a href="/returns" className="hover:text-primary-light">Returns Policy</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary-light">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms" className="hover:text-primary-light">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="mb-2">Email: support@grapheneosstore.com</p>
            <p className="mb-4">Phone: +44 20 1234 5678</p>
            
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="hover:text-primary-light">
                Twitter
              </a>
              <a href="https://github.com" className="hover:text-primary-light">
                GitHub
              </a>
              <a href="https://reddit.com" className="hover:text-primary-light">
                Reddit
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>
            &copy; {currentYear} GrapheneOS Store. All rights reserved.
          </p>
          <p className="mt-2">
            GrapheneOS is a registered trademark. Google Pixel is a trademark of Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;