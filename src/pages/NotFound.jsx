import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* BACKGROUND: Subtle Floating Gears (Decoration) */}
      <motion.div
        animate={{ 
          rotate: 360,
          transition: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        className="mt-10 absolute top-20 left-10 w-24 h-24 opacity-5 bg-gray-800 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ 
          rotate: -360,
          transition: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
        className="absolute bottom-20 right-10 w-32 h-32 opacity-5 bg-gray-800 rounded-full pointer-events-none"
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="mt-18 relative z-10 flex flex-col items-center w-full max-w-4xl">
        
        {/* 1. ROBOT ILLUSTRATION WITH FLOATING EFFECT */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ 
            y: [0, -15, 0], // Floating up and down
            opacity: 1
          }}
          transition={{ 
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.8 }
          }}
          className="relative w-full max-w-md md:max-w-lg mb-4"
        >
          {/* 
             NOTE: Replace this src with your exact illustration file if you have it!
             I am using a high-quality 404 Robot illustration from a CDN.
          */}
          <img 
            src="https://i.pinimg.com/originals/07/ba/ed/07baed84752da66c94333e268dc15ffc.gif" 
            // Or use this direct broken robot vector:
            // src="https://cdn-icons-png.flaticon.com/512/5832/5832444.png"
            alt="Broken Robot 404 Error" 
            className="w-full h-auto object-contain drop-shadow-xl"
          />

          {/* SPARK / EXPLOSION PARTICLES (Decorative CSS animation) */}
          <motion.div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Simple sparks using dots */}
            <div className="absolute top-[25%] left-[45%] w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute top-[30%] left-[55%] w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping delay-75"></div>
            <div className="absolute top-[20%] left-[50%] w-2 h-2 bg-orange-500 rounded-full animate-ping delay-150"></div>
          </motion.div>
        </motion.div>


        {/* 2. SPEECH BUBBLE BOX */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 150 }}
          className="relative bg-white border-2 border-gray-200 rounded-3xl px-10 py-6 md:px-14 md:py-8 mt-2 shadow-sm text-center w-full max-w-md"
        >
          {/* Speech bubble tail (CSS Triangle pointing up) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-t-2 border-l-2 border-gray-200 transform rotate-45"></div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-black tracking-tight">
            Oops!
          </h1>
          <div className="text-3xl md:text-4xl font-semibold text-gray-800 mt-1">
            404 Error
          </div>
        </motion.div>


        {/* 3. HELPFUL TEXT & ACTION BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-8 text-center max-w-md"
        >
          <p className="text-sm md:text-base text-gray-500 font-light mb-6">
            ទំព័រដែលអ្នកកំពុងស្វែងរកត្រូវបានផ្តាច់ចេញហើយ!<br/>
            (The page you are looking for is broken!)
          </p>
          
          <Link 
            to="/"
            className="inline-block bg-[#25398C] text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            ត្រឡប់ទៅទំព័រដើម (Back to Home)
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;