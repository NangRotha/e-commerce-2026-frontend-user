import { useState, useEffect } from 'react';
import { FiFacebook, FiInstagram, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { settingsAPI } from '../../services/api';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback Data in case Backend is empty or offline
  const fallbackData = {
    brandName: 'MarketPlace',
    description: 'ទីផ្សារអនឡាញដែលផ្តល់នូវគុណភាពខ្ពស់ និងសេវាកម្មដែលគួរឱ្យទុកចិត្តបំផុត។',
    companyLinks: ['អំពីយើង', 'អាជីពការងារ', 'ប្លុក'],
    helpLinks: ['Privacy Policy', 'Terms of Service', 'Help Center'],
    contact: {
      phone: '០១២ ៣៤៥ ៦៧៨',
      email: 'info@marketplace.com.kh',
      address: 'ផ្លូវជាតិលេខ៦, កម្ពុជា'
    },
    social: ['Facebook', 'Instagram']
  };

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const res = await settingsAPI.getFooter();
      if (res.data) {
        setFooterData(res.data);
      } else {
        setFooterData(fallbackData);
      }
    } catch (error) {
      console.log('Using fallback footer');
      setFooterData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !footerData) {
    return <div className="bg-[#F4F5FF] h-40 flex items-center justify-center text-gray-400 text-sm">កំពុងផ្ទុក Footer...</div>;
  }

  return (
    <div className="w-full flex justify-center px-4 pb-6">
      
      {/* Glassmorphism Footer Container */}
      <footer className="w-full max-w-6xl bg-white/70 backdrop-blur-md border border-white/50 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 md:p-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-[#3B82F6] mb-4 tracking-tight">{footerData.brandName || 'MarketPlace'}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {footerData.description || 'ទីផ្សារអនឡាញដែលផ្តល់នូវគុណភាពខ្ពស់ និងសេវាកម្មដែលគួរឱ្យទុកចិត្តបំផុត។'}
            </p>
            <div className="flex space-x-4 text-[#3B82F6]">
              {footerData.social?.includes('Facebook') && (
                <a href="#" className="bg-white/60 p-2.5 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <FiFacebook className="text-lg" />
                </a>
              )}
              {footerData.social?.includes('Instagram') && (
                <a href="#" className="bg-white/60 p-2.5 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <FiInstagram className="text-lg" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="font-semibold text-[#1A237E] mb-5 text-sm uppercase tracking-wider">ក្រុមហ៊ុន</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {footerData.companyLinks?.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-[#3B82F6] transition-colors duration-300">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h4 className="font-semibold text-[#1A237E] mb-5 text-sm uppercase tracking-wider">ជំនួយ</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {footerData.helpLinks?.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-[#3B82F6] transition-colors duration-300">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-semibold text-[#1A237E] mb-5 text-sm uppercase tracking-wider">ទំនាក់ទំនង</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {footerData.contact?.phone && (
                <li className="flex items-center gap-3">
                  <FiPhone className="text-[#3B82F6]" /> {footerData.contact.phone}
                </li>
              )}
              {footerData.contact?.email && (
                <li className="flex items-center gap-3">
                  <FiMail className="text-[#3B82F6]" /> {footerData.contact.email}
                </li>
              )}
              {footerData.contact?.address && (
                <li className="flex items-center gap-3">
                  <FiMapPin className="text-[#3B82F6]" /> {footerData.contact.address}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright Bottom - Glass Line */}
        <div className="border-t border-white/60 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {footerData.brandName || 'MarketPlace'} Corporate. All rights reserved.</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-[#3B82F6] transition-colors duration-300 hover:translate-y-[-2px] hover:shadow-sm px-2">Privacy Policy</a>
            <a href="#" className="hover:text-[#3B82F6] transition-colors duration-300 hover:translate-y-[-2px] hover:shadow-sm px-2">Terms of Service</a>
            <a href="#" className="hover:text-[#3B82F6] transition-colors duration-300 hover:translate-y-[-2px] hover:shadow-sm px-2">Help Center</a>
            <a href="#" className="hover:text-[#3B82F6] transition-colors duration-300 hover:translate-y-[-2px] hover:shadow-sm px-2">Contact Us</a>
          </div>
        </div>
        
      </footer>
    </div>
  );
};

export default Footer;