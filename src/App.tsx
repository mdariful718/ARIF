import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Wallet, 
  ShoppingCart, 
  History, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  MessageCircle, 
  Send,
  ShieldCheck,
  ShieldAlert,
  Zap,
  CreditCard,
  LayoutDashboard,
  Settings,
  Bell,
  Search
} from 'lucide-react';

// --- Types ---
interface Package {
  id: number;
  category: string;
  name: string;
  price: number;
  diamonds: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  wallet_balance: number;
  role: string;
  profile_pic?: string;
}

interface Order {
  id: number;
  package_name: string;
  price: number;
  player_uid: string;
  status: string;
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  completed_at?: string;
}

// --- Components ---

const Logo = ({ className = "w-10 h-10", showText = false, orientation = "vertical" }: { className?: string, showText?: boolean, orientation?: "horizontal" | "vertical" }) => (
  <div className={`flex ${orientation === "vertical" ? "flex-col" : "flex-row"} items-center gap-1.5 ${className}`}>
    <div className="h-full aspect-square shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dark Background */}
        <rect width="100" height="100" rx="24" fill="#020617" />
        
        {/* Controller Outline (Electric Blue) */}
        <path 
          d="M 22 55 Q 22 35 50 35 Q 78 35 78 55 Q 78 82 60 82 L 55 65 H 45 L 40 82 Q 22 82 22 55 Z" 
          stroke="#2563eb" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Lightning Bolt (Bright Orange) */}
        <path 
          d="M 54 25 L 42 50 H 58 L 46 75" 
          stroke="#f97316" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Controller Details */}
        <circle cx="33" cy="55" r="3" fill="#2563eb" opacity="0.5" />
        <circle cx="67" cy="55" r="3" fill="#2563eb" opacity="0.5" />
      </svg>
    </div>
    {showText && (
      <div className={`flex flex-col ${orientation === "vertical" ? "items-center" : "items-start"} leading-none`}>
        <span className={`${orientation === "vertical" ? "text-[10px]" : "text-sm"} font-black tracking-tighter uppercase whitespace-nowrap`}>
          <span className="text-white">CVV</span>{" "}
          <span className="text-[#f97316]">TOP UP</span>{" "}
          <span className="text-white">CB</span>
        </span>
      </div>
    )}
  </div>
);

const Header = ({ user, onLogout, onOpenAuth, onOpenDashboard, onOpenTrack }: { user: User | null, onLogout: () => void, onOpenAuth: (mode: 'login' | 'register') => void, onOpenDashboard: () => void, onOpenTrack: () => void }) => {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
          <Logo className="h-6" showText orientation="horizontal" />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenTrack}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg transition-all"
          >
            <Search className="w-4 h-4" /> Track Order
          </button>
          {!user && (
            <button 
              onClick={onOpenDashboard}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg transition-all"
            >
              <History className="w-4 h-4" /> My Orders
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-zinc-400 font-medium">Wallet Balance</span>
                <span className="text-sm font-bold text-emerald-400">৳{user.wallet_balance.toFixed(2)}</span>
              </div>
              <button 
                onClick={onOpenDashboard}
                className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-300 flex items-center gap-2"
              >
                {user.profile_pic ? (
                  <img 
                    src={user.profile_pic} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </button>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-zinc-400 hover:text-white font-bold transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => onOpenAuth('register')}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const ScrollingNotice = () => (
  <div className="bg-emerald-500/10 border-y border-emerald-500/20 py-2 overflow-hidden whitespace-nowrap">
    <div className="animate-marquee inline-block text-emerald-400 text-sm font-medium">
      🔥 Special Offer: Get 10% extra diamonds on your first UID top-up today! • ⚡ Instant delivery guaranteed • 🛡️ 100% Secure Payment via bKash, Nagad & Rocket • 📞 24/7 Customer Support available via WhatsApp and Telegram • 
    </div>
  </div>
);

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    { title: "Weekly Membership", desc: "Get 450 Diamonds + Daily Rewards", img: "https://picsum.photos/seed/ff1/1200/400" },
    { title: "Level Up Pass", desc: "Unlock massive rewards as you level up", img: "https://picsum.photos/seed/ff2/1200/400" },
    { title: "Monthly Membership", desc: "The ultimate value for serious gamers", img: "https://picsum.photos/seed/ff3/1200/400" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-48 md:h-80 overflow-hidden rounded-2xl mx-4 mt-6 group">
      {slides.map((slide, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: idx === current ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img src={slide.img} className="w-full h-full object-cover" alt={slide.title} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-8 md:px-16">
            <h2 className="text-2xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">{slide.title}</h2>
            <p className="text-zinc-300 text-sm md:text-lg max-w-md">{slide.desc}</p>
            <button className="mt-4 md:mt-6 w-fit px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors">
              Buy Now
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const ServiceCard = ({ title, icon: Icon, onClick }: { title: string, icon: any, onClick: () => void }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all group"
  >
    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/10 transition-colors">
      <Icon className="w-6 h-6 text-emerald-500" />
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
    <p className="text-zinc-500 text-sm">Instant delivery to your game account.</p>
    <div className="mt-4 flex items-center text-emerald-500 text-sm font-bold">
      Order Now <ChevronRight className="w-4 h-4 ml-1" />
    </div>
  </motion.div>
);

const ManualPaymentVerification = ({ isOpen, onClose, method, amount, onVerify }: { isOpen: boolean, onClose: () => void, method: 'bkash' | 'nagad', amount: number, onVerify: (trxId: string, contact: string) => void }) => {
  const [trxId, setTrxId] = useState('');
  const [contact, setContact] = useState('');
  const merchantNumber = "01766315534";
  const isNagad = method === 'nagad';
  const themeColor = isNagad ? 'bg-[#ED1C24]' : 'bg-[#E2136E]';
  const hoverColor = isNagad ? 'hover:bg-[#D11920]' : 'hover:bg-[#C1105D]';

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantNumber);
    alert("নম্বরটি কপি করা হয়েছে!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${themeColor} w-full max-w-md rounded-3xl overflow-hidden shadow-2xl text-white relative`}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-all z-[999] group"
          title="বন্ধ করুন"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <h3 className="text-xl font-bold uppercase tracking-tighter">Payment Verification</h3>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-2 opacity-80">আপনার হোয়াটসঅ্যাপ বা কন্টাক্ট নম্বর দিন</label>
              <input 
                type="text" 
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 font-bold focus:outline-none shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 opacity-80 text-center">ট্রান্সেকশন আইডি দিন</label>
              <input 
                type="text" 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="Enter TrxID"
                className="w-full bg-white text-zinc-900 rounded-xl px-4 py-4 text-center font-black text-xl focus:outline-none shadow-inner"
              />
            </div>
          </div>

          <div className="bg-black/10 rounded-2xl p-6 space-y-4 text-sm leading-relaxed">
            <div className="flex gap-3">
              <span className="font-bold opacity-60">ধাপ ১:</span>
              <p>{isNagad ? '*167#' : '*247#'} ডায়াল করে আপনার {isNagad ? 'Nagad' : 'bKash'} মোবাইল মেনুতে যান অথবা {isNagad ? 'Nagad' : 'bKash'} অ্যাপে যান।</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold opacity-60">ধাপ ২:</span>
              <p>"Send Money" -এ ক্লিক করুন।</p>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold opacity-60">ধাপ ৩:</span>
              <div className="flex-1 flex items-center justify-between bg-white/10 px-3 py-2 rounded-lg">
                <p className="font-mono font-bold">{merchantNumber}</p>
                <button onClick={handleCopy} className="p-1 hover:bg-white/20 rounded transition-colors flex items-center gap-1 text-[10px] uppercase font-bold">
                  <ShoppingCart className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-bold opacity-60">ধাপ ৪:</span>
              <p>টাকার পরিমাণঃ <span className="font-black text-lg">৳{amount}</span></p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold opacity-60">ধাপ ৫:</span>
              <p>নিশ্চিত করতে এখন আপনার {isNagad ? 'Nagad' : 'bKash'} মোবাইল মেনু পিন লিখুন।</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold opacity-60">ধাপ ৬:</span>
              <p>সবকিছু ঠিক থাকলে, আপনি {isNagad ? 'Nagad' : 'bKash'} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold opacity-60">ধাপ ৭:</span>
              <p>এখন উপরের বক্সে আপনার Transaction ID দিন এবং নিচের VERIFY বাটনে ক্লিক করুন।</p>
            </div>
          </div>

          <button 
            onClick={() => {
              onVerify(trxId, contact);
              setTrxId('');
              setContact('');
            }}
            disabled={!trxId}
            className={`w-full py-4 bg-white text-zinc-900 font-black text-xl rounded-2xl transition-all shadow-lg disabled:opacity-50 active:scale-95`}
          >
            VERIFY
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PaymentGateway = ({ isOpen, onClose, amount, merchantName, onManualPayment }: { isOpen: boolean, onClose: () => void, amount: number, merchantName: string, onManualPayment: (method: 'bkash' | 'nagad') => void }) => {
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col text-zinc-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-full transition-colors">
            <LayoutDashboard className="w-6 h-6 text-zinc-600" />
          </button>
          <button className="p-1 hover:bg-zinc-100 rounded-full transition-colors">
            <Settings className="w-6 h-6 text-zinc-600" />
          </button>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-zinc-600" />
        </button>
      </div>

      {/* Merchant Info */}
      <div className="flex flex-col items-center py-8 bg-zinc-50">
        <Logo className="h-14 mb-4" showText orientation="vertical" />
        <h1 className="text-xl font-black tracking-tighter uppercase text-zinc-400 opacity-50">{merchantName}</h1>
      </div>

      {/* Payment Methods */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full overflow-y-auto">
        <div className="bg-blue-600 text-white py-3 px-6 rounded-t-xl font-bold text-center mb-4">
          Mobile Banking
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div 
            onClick={() => setSelectedMethod('bkash')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 relative ${selectedMethod === 'bkash' ? 'border-[#E2136E] bg-[#E2136E]/5' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}
          >
            <div className="w-16 h-16 bg-[#E2136E] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              bKash
            </div>
            <span className="font-bold text-zinc-700">bKash</span>
            {selectedMethod === 'bkash' && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-[#E2136E] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div 
            onClick={() => setSelectedMethod('nagad')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 relative ${selectedMethod === 'nagad' ? 'border-[#ED1C24] bg-[#ED1C24]/5' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}
          >
            <div className="w-16 h-16 bg-[#ED1C24] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              Nagad
            </div>
            <span className="font-bold text-zinc-700">Nagad</span>
            {selectedMethod === 'nagad' && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-[#ED1C24] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Rules & Conditions Section */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4 text-amber-800">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-lg">Rules & Conditions (নিয়ম ও শর্তাবলী)</h3>
          </div>
          <div className="space-y-4 text-sm text-amber-900 leading-relaxed">
            <div className="flex gap-3">
              <span className="font-bold shrink-0">১.</span>
              <p>শুধুমাত্র Bangladesh সার্ভারের ID Code ব্যবহার করে এই ওয়েবসাইট থেকে টপ-আপ করা যাবে। অন্য কোনো সার্ভারের আইডি দিলে টপ-আপ সম্পন্ন হবে না।</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold shrink-0">২.</span>
              <p>Player ID Code ভুল দেওয়ার কারণে অন্য কারো আইডিতে Diamond চলে গেলে CVV TOP UP CB কর্তৃপক্ষ কোনোভাবেই দায়ী থাকবে না। টাকা পাঠানোর আগে অবশ্যই 'আপনার গেম আইডির নাম চেক করুন' বাটনে ক্লিক করে গেমের আসল নামটি মিলিয়ে নেওয়ার জন্য অনুরোধ করা হচ্ছে।</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold shrink-0">৩.</span>
              <p>ওয়েবসাইটে আপনার অর্ডারের স্ট্যাটাস "Complete" দেখানোর পরেও যদি গেম আইডিতে ডাইমন্ড না যায়, তবে বিষয়টি ম্যানুয়ালি চেক এবং সমাধান করার জন্য সাময়িকভাবে আপনার গেমের ID এবং Password দিতে হতে পারে।</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold shrink-0">৪.</span>
              <p>কোনো কারণে আপনার অর্ডারটি Cancel (বাতিল) করা হলে, ঠিক কী কারণে বাতিল হয়েছে তা আপনার ড্যাশবোর্ডের "My Orders" অপশনে স্পষ্টভাবে উল্লেখ করা থাকবে। অনুগ্রহপূর্বক সেটি দেখে পুনরায় সঠিক তথ্য দিয়ে নতুন করে টপ-আপ অর্ডার করুন।</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold shrink-0">৫.</span>
              <p><span className="font-bold text-red-600">পেমেন্ট সতর্কতা:</span> বিকাশ বা নগদ থেকে সফলভাবে টাকা পাঠানোর পরেই কেবল সঠিক Transaction ID (TrxID) সাবমিট করবেন। কোনো ভুয়া (Fake) ট্রানজেকশন আইডি বা ভুল তথ্য দিলে বিনা নোটিশে আপনার ওয়েবসাইট অ্যাকাউন্টটি স্থায়ীভাবে ব্যান (Ban) করে দেওয়া হবে।</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold shrink-0">৬.</span>
              <p><span className="font-bold text-emerald-700">ডেলিভারি সময়:</span> অর্ডার করার পর টপ-আপ কমপ্লিট হতে সাধারণত ১ থেকে ৫ মিনিট সময় লাগতে পারে। অর্ডারের রিয়েল-টাইম অবস্থা এবং কনফার্মেশনের একদম সঠিক সময় (সেকেন্ডসহ) জানতে আপনার অ্যাকাউন্টের "My Orders" অপশনটিতে নজর রাখুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <div className="p-4 border-t border-zinc-100 max-w-md mx-auto w-full">
        <button 
          disabled={!selectedMethod}
          onClick={() => selectedMethod && onManualPayment(selectedMethod)}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xl rounded-2xl transition-all shadow-lg shadow-blue-500/20"
        >
          Pay {amount.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

const TrackOrderModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query)}`);
      const data = await res.json();
      setOrders(data);
      setSearched(true);
    } catch (e) {
      alert("Error tracking order");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all z-[999] group"
          title="বন্ধ করুন"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-500" /> Track Order (অর্ডার স্ট্যাটাস)
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleTrack} className="flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order ID (#CVV...) বা কন্টাক্ট নম্বর দিন"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              Search
            </button>
          </form>

          <div className="max-h-[50vh] overflow-y-auto space-y-4">
            {loading ? (
              <div className="text-center py-8 text-zinc-500">Searching...</div>
            ) : searched && orders.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">কোনো অর্ডার পাওয়া যায়নি।</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-bold">{order.package_name}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${order.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-zinc-500 text-xs space-y-1">
                    <div>Order ID: <span className="text-zinc-300">{order.order_id_string}</span></div>
                    <div>UID: <span className="text-zinc-300">{order.player_uid}</span></div>
                    <div>Date: <span className="text-zinc-300">{formatDate(order.created_at)}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const OrderModal = ({ isOpen, onClose, category, packages, user, onOrderSuccess, onOpenAuth, onOpenPayment }: { isOpen: boolean, onClose: () => void, category: string, packages: Package[], user: User | null, onOrderSuccess: (orderIdString?: string) => void, onOpenAuth: () => void, onOpenPayment: (amount: number, pkg: Package, uid: string) => void }) => {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [uid, setUid] = useState('');
  const [gameName, setGameName] = useState('');
  const [isNameConfirmed, setIsNameConfirmed] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'instant'>('wallet');
  const [loading, setLoading] = useState(false);
  const [checkingName, setCheckingName] = useState(false);
  const [error, setError] = useState('');

  // Load pending order data from localStorage on open
  useEffect(() => {
    if (isOpen) {
      const savedUid = localStorage.getItem('pending_uid');
      const savedPkgId = localStorage.getItem('pending_pkg_id');
      
      if (savedUid) setUid(savedUid);
      if (savedPkgId && packages.length > 0) {
        const pkg = packages.find(p => p.id === parseInt(savedPkgId));
        if (pkg && pkg.category === category) {
          setSelectedPkg(pkg);
        }
      }
      setError('');
      setIsNameConfirmed(false);
      setGameName('');
    }
  }, [isOpen, category, packages]);

  // Reset confirmation if UID changes
  useEffect(() => {
    setIsNameConfirmed(false);
    setGameName('');
  }, [uid]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleCheckName = async () => {
    if (!uid) {
      setError("দয়া করে আগে প্লেয়ার আইডি দিন");
      return;
    }
    if (cooldown > 0) return;

    setError('');
    setCheckingName(true);
    
    try {
      const res = await fetch(`/api/check-player/${uid}`);
      const data = await res.json();
      if (data.success) {
        setGameName(data.name);
        setIsNameConfirmed(true);
        setCooldown(5); // 5 seconds cooldown
      } else {
        setError(data.message);
        setIsNameConfirmed(false);
      }
    } catch (e) {
      setError("সার্ভারে সমস্যা হচ্ছে, আবার চেষ্টা করুন");
    } finally {
      setCheckingName(false);
    }
  };

  const handleOrder = async () => {
    setError('');
    
    if (!selectedPkg) {
      setError("দয়া করে একটি প্যাকেজ সিলেক্ট করুন");
      return;
    }
    
    if (!uid) {
      setError("দয়া করে আপনার প্লেয়ার আইডি দিন");
      return;
    }

    if (!isNameConfirmed) {
      setError("দয়া করে আগে আপনার গেম আইডির নাম চেক করে কনফার্ম করুন");
      return;
    }

    if (paymentMethod === 'instant') {
      onOpenPayment(selectedPkg.price, selectedPkg, uid);
      return;
    }

    if (!user) {
      setError("ওয়ালেট পেমেন্টের জন্য লগ-ইন করা প্রয়োজন। দয়া করে লগ-ইন করুন অথবা Instant Pay সিলেক্ট করুন।");
      return;
    }

    if (user.wallet_balance < selectedPkg.price) {
      setError("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। দয়া করে টাকা অ্যাড করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, package_id: selectedPkg.id, player_uid: uid })
      });
      const data = await res.json();
      if (data.success) {
        onOrderSuccess(data.order_id_string);
        onClose();
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError("সার্ভারে সমস্যা হচ্ছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-500" /> {category}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full text-zinc-400 transition-all z-[999] group"
            title="বন্ধ করুন"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8">
          {/* 1. Package Selection */}
          <section>
            <label className="block text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-xs">1</span>
              প্যাকেজ নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {packages.filter(p => p.category === category).map(pkg => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${selectedPkg?.id === pkg.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'}`}
                >
                  <div className="text-white font-bold text-sm">{pkg.name}</div>
                  <div className="text-emerald-400 text-lg font-black">৳{pkg.price}</div>
                  {selectedPkg?.id === pkg.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 2. Account Info */}
          <section>
            <label className="block text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-xs">2</span>
              Account Info (গেম আইডি সংগ্রহ)
            </label>
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="এখানে প্লেয়ার আইডি কোড দিন"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors text-lg"
                />
              </div>
              
              <button 
                onClick={handleCheckName}
                disabled={checkingName || !uid || cooldown > 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {checkingName ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : null}
                {checkingName ? 'Checking...' : (cooldown > 0 ? `Wait ${cooldown}s` : 'আপনার গেম আইডির নাম চেক করুন')}
              </button>

              {gameName && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-bold text-center flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  ✓ আপনার গেম আইডি: {gameName}
                </motion.div>
              )}
            </div>
          </section>

          {/* 3. Payment Method */}
          <section>
            <label className="block text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-xs">3</span>
              Select one option (পেমেন্ট মেথড নির্বাচন)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 relative ${paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'}`}
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-white font-bold">Wallet Pay</div>
                  <div className="text-zinc-500 text-xs">Pay from your balance</div>
                </div>
                {paymentMethod === 'wallet' && (
                  <div className="absolute top-4 right-4 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div 
                onClick={() => setPaymentMethod('instant')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 relative ${paymentMethod === 'instant' ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'}`}
              >
                <div className="w-12 h-12 bg-zinc-700 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    <div className="w-4 h-4 bg-pink-500 rounded-sm" />
                    <div className="w-4 h-4 bg-orange-500 rounded-sm" />
                    <div className="w-4 h-4 bg-purple-500 rounded-sm" />
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold">Instant Pay</div>
                  <div className="text-zinc-500 text-xs">bKash, Nagad, Rocket</div>
                </div>
                {paymentMethod === 'instant' && (
                  <div className="absolute top-4 right-4 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 4. Summary & Action */}
          <section className="pt-4 border-t border-zinc-800">
            <div className="bg-zinc-800/30 p-4 rounded-2xl mb-6">
                <div className="flex items-center gap-2 text-zinc-300 text-sm mb-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                <span>ⓘ প্রোডাক্টটি কিনতে আপনার প্রয়োজন <span className="text-emerald-400 font-bold">৳{selectedPkg?.price || 0}</span> টাকা।</span>
              </div>
              {!user && paymentMethod === 'wallet' && (
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                  <X className="w-4 h-4" />
                  <span>ⓘ Wallet Pay requires Login</span>
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mb-4 font-medium text-center">{error}</p>}

            <button 
              onClick={handleOrder}
              disabled={loading || !isNameConfirmed}
              className={`w-full py-4 font-black text-xl rounded-2xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-white`}
            >
              {loading ? 'Processing...' : 'BUY NOW'}
            </button>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, onAuthSuccess, initialMode = 'login', initialToken = '' }: { isOpen: boolean, onClose: () => void, onAuthSuccess: (user: User) => void, initialMode?: 'login' | 'register' | 'forgot' | 'reset', initialToken?: string }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [resetToken, setResetToken] = useState(initialToken);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setResetToken(initialToken);
    setError('');
    setSuccessMessage('');
  }, [initialMode, initialToken, isOpen]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        onAuthSuccess(event.data.user);
        onClose();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAuthSuccess, onClose]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations for Registration & Reset
    if (mode === 'register' || mode === 'reset') {
      if (mode === 'register') {
        if (!formData.name.trim()) {
          setError("দয়া করে আপনার পুরো নাম লিখুন");
          return;
        }
        if (!validateEmail(formData.email)) {
          setError("দয়া করে একটি সঠিক ইমেইল অ্যাড্রেস দিন (যেমন- name@gmail.com)");
          return;
        }
      }
      if (formData.password.length < 8 || formData.password.length > 16) {
        setError("পাসওয়ার্ড অবশ্যই ৮ থেকে ১৬ অক্ষরের মধ্যে হতে হবে।");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("পাসওয়ার্ড মিলেনি");
        return;
      }
    }

    setIsLoading(true);
    let endpoint = '';
    let body = {};

    if (mode === 'login') {
      endpoint = '/api/login';
      body = { email: formData.email, password: formData.password };
    } else if (mode === 'register') {
      endpoint = '/api/register';
      body = { name: formData.name, email: formData.email, password: formData.password };
    } else if (mode === 'forgot') {
      endpoint = '/api/auth/forgot-password';
      body = { email: formData.email };
    } else if (mode === 'reset') {
      endpoint = '/api/auth/reset-password';
      body = { token: resetToken, password: formData.password };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (mode === 'forgot') {
          setSuccessMessage(data.message);
          // For demo purposes, if debugToken is provided, we can simulate the link
          if (data.debugToken) {
            console.log("Debug Reset Token:", data.debugToken);
          }
        } else if (mode === 'reset') {
          setSuccessMessage(data.message);
          setTimeout(() => setMode('login'), 2000);
        } else {
          onAuthSuccess(data.user);
          onClose();
        }
      } else {
        setError(data.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।");
      }
    } catch (e) {
      console.error("Connection Error:", e);
      setError("সিস্টেমে সমস্যা হচ্ছে বা সার্ভার কানেক্ট করা যাচ্ছে না। দয়া করে ইন্টারনেট চেক করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Fetch the OAuth URL from your server
      const response = await fetch(`/api/auth/url/${provider}`);
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      const { url } = await response.json();

      // 2. Open the OAuth PROVIDER's URL directly in popup
      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        setError('Please allow popups for this site to connect your account.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8 relative"
      >
        <button 
          onClick={handleClose} 
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all z-[999] group"
          title="বন্ধ করুন"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Registration' : mode === 'forgot' ? 'Forgot Password' : 'Reset Password'}
          </h2>
        </div>

        {successMessage ? (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <p className="text-emerald-400 font-bold">{successMessage}</p>
            {mode === 'forgot' && (
              <button 
                onClick={() => { setSuccessMessage(''); setMode('login'); }}
                className="text-emerald-500 font-bold hover:underline"
              >
                Back to Login
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Full Name (ফুল নেম)</label>
                <input 
                  type="text" 
                  required
                  placeholder="আপনার পুরো নাম লিখুন"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email Address (ইমেইল অ্যাড্রেস)</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@gmail.com"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'reset') && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase">
                    {mode === 'reset' ? 'New Password (নতুন পাসওয়ার্ড)' : 'Password (পাসওয়ার্ড)'}
                  </label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] text-emerald-500 font-bold hover:underline uppercase"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="৮-১৬ অক্ষরের পাসওয়ার্ড"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            )}

            {(mode === 'register' || mode === 'reset') && (
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Verify Password (ভেরিফাই পাসওয়ার্ড)</label>
                <input 
                  type="password" 
                  required
                  placeholder="আবার পাসওয়ার্ডটি লিখুন"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-sm font-medium"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'register' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'প্রসেসিং হচ্ছে...'}</span>
                </>
              ) : (
                mode === 'login' ? 'Login' : 
                mode === 'register' ? 'Create Account' : 
                mode === 'forgot' ? 'Send Reset Link' : 'Reset Password'
              )}
            </button>

            {(mode === 'login' || mode === 'register') && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-zinc-900 text-zinc-500 uppercase font-bold">অথবা</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full bg-white text-zinc-900 py-4 rounded-xl font-black hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  গুগল দিয়ে সাইন-ইন করুন
                </button>
              </>
            )}
          </form>
        )}

        {!successMessage && (
          <p className="mt-6 text-center text-zinc-500 text-sm">
            {mode === 'login' ? "Don't have an account?" : mode === 'register' ? "Already have an account?" : "Remembered your password?"}
            <button 
              onClick={() => {
                if (mode === 'login') setMode('register');
                else setMode('login');
              }}
              className="ml-2 text-emerald-500 font-bold hover:underline"
            >
              {mode === 'login' ? 'Register Now' : 'Login Now'}
            </button>
          </p>
        )}

        {(mode === 'login' || mode === 'register') && (
          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-4 text-zinc-500 font-bold tracking-widest">Or Continue With</span></div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl transition-all disabled:opacity-50"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  title="One-Tap Login with Facebook"
                  className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('twitter')}
                  disabled={isLoading}
                  title="One-Tap Login with Twitter"
                  className="flex items-center justify-center gap-2 py-3 bg-black hover:bg-zinc-900 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>Twitter</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, isOpen, onClose }: { user: User | null, isOpen: boolean, onClose: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'wallet' | 'profile'>('history');

  useEffect(() => {
    const fetchOrders = async () => {
      if (isOpen) {
        let allOrders: Order[] = [];
        if (user) {
          const userOrdersRes = await fetch(`/api/orders/${user.id}`);
          allOrders = await userOrdersRes.json();
        }
        
        const guestOrderIds = JSON.parse(localStorage.getItem('guest_orders') || '[]');
        
        if (guestOrderIds.length > 0) {
          const guestOrdersRes = await fetch('/api/orders/guest-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderIds: guestOrderIds })
          });
          const guestOrders = await guestOrdersRes.json();
          
          // Merge and remove duplicates (by id)
          const orderMap = new Map();
          allOrders.forEach(o => orderMap.set(o.id, o));
          guestOrders.forEach((o: Order) => orderMap.set(o.id, o));
          allOrders = Array.from(orderMap.values());
          
          // Sort by date descending
          allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
        setOrders(allOrders);
      }
    };
    fetchOrders();
  }, [isOpen, user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Use Intl.DateTimeFormat to force Bangladesh (Asia/Dhaka) timezone
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value;
    
    const day = getPart('day');
    const month = getPart('month');
    const year = getPart('year');
    const hour = getPart('hour');
    const minute = getPart('minute');
    const second = getPart('second');
    const ampm = getPart('dayPeriod')?.toUpperCase() || '';
    
    return `${day}-${month}-${year}, ${hour}:${minute}:${second} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        className="bg-zinc-900 border-l border-zinc-800 w-full max-w-2xl h-full absolute right-0 shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user ? (
              user.profile_pic ? (
                <img 
                  src={user.profile_pic} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full border border-zinc-700 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-xl">
                  {user.name[0]}
                </div>
              )
            ) : (
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                <User className="w-6 h-6 text-zinc-500" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{user ? user.name : 'Guest User'}</h2>
              <p className="text-zinc-500 text-sm">{user ? user.email : 'No account connected'}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-all z-[999] group"
            title="বন্ধ করুন"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="flex border-b border-zinc-800 items-center pr-4">
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'history' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-zinc-500'}`}
          >
            Orders
          </button>
          {user && (
            <>
              <button 
                onClick={() => setActiveTab('wallet')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'wallet' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-zinc-500'}`}
              >
                Wallet
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'profile' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-zinc-500'}`}
              >
                Profile
              </button>
            </>
          )}
          {activeTab === 'history' && (
            <button 
              onClick={async () => {
                let allOrders: Order[] = [];
                if (user) {
                  const userOrdersRes = await fetch(`/api/orders/${user.id}`);
                  allOrders = await userOrdersRes.json();
                }
                const guestOrderIds = JSON.parse(localStorage.getItem('guest_orders') || '[]');
                if (guestOrderIds.length > 0) {
                  const guestOrdersRes = await fetch('/api/orders/guest-history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderIds: guestOrderIds })
                  });
                  const guestOrders = await guestOrdersRes.json();
                  const orderMap = new Map();
                  allOrders.forEach(o => orderMap.set(o.id, o));
                  guestOrders.forEach((o: Order) => orderMap.set(o.id, o));
                  allOrders = Array.from(orderMap.values());
                  allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                }
                setOrders(allOrders);
              }}
              className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-emerald-500 transition-colors"
              title="Refresh Orders"
            >
              <History className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'history' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">No orders found.</div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-bold">{order.package_name}</div>
                        <div className="text-zinc-500 text-xs mt-1">UID: {order.player_uid}</div>
                        <div className="text-zinc-500 text-[10px] mt-1">Method: {order.payment_method} {order.transaction_id && `• TrxID: ${order.transaction_id}`}</div>
                        <div className="text-zinc-500 text-[10px] mt-1">Date: {formatDate(order.created_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-black">৳{order.price}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${order.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {order.status}
                          </span>
                          {order.status === 'complete' && order.completed_at && (
                            <span className="text-zinc-500 text-[10px]">({formatDate(order.completed_at)})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center">
                <span className="text-zinc-400 text-sm font-medium">Current Balance</span>
                <h3 className="text-4xl font-black text-emerald-400 mt-1">৳{user.wallet_balance.toFixed(2)}</h3>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Add Money</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['bKash', 'Nagad', 'Rocket'].map(method => (
                    <button key={method} className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl hover:border-emerald-500 transition-all flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-zinc-700 rounded-lg" />
                      <span className="text-xs font-bold text-zinc-300">{method}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
                  To add money, select a payment method and follow the instructions. Automatic payment gateway is coming soon!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700">
                <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
                <div className="text-white font-medium mt-1">{user.name}</div>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700">
                <label className="text-xs font-bold text-zinc-500 uppercase">Email Address</label>
                <div className="text-white font-medium mt-1">{user.email}</div>
              </div>
              <button className="w-full py-4 border border-zinc-700 rounded-2xl text-zinc-300 font-bold hover:bg-zinc-800 transition-all">
                Change Password
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [authMode, setAuthMode] = useState<{ mode: 'login' | 'register' | 'forgot' | 'reset', token?: string }>({ mode: 'login' });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [paymentData, setPaymentData] = useState<{ isOpen: boolean, amount: number, pkg?: Package, uid?: string }>({ isOpen: false, amount: 0 });
  const [manualPayment, setManualPayment] = useState<{ isOpen: boolean, method: 'bkash' | 'nagad', amount: number, pkg?: Package, uid?: string }>({ isOpen: false, method: 'bkash', amount: 0 });

  useEffect(() => {
    fetch('/api/packages').then(res => res.json()).then(setPackages);
    // Check for existing session (simplified)
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Check for reset token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token && window.location.pathname === '/reset-password') {
      setAuthMode({ mode: 'reset', token });
      setIsAuthOpen(true);
      // Clean up URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const refreshUser = async (orderIdString?: string) => {
    if (orderIdString) {
      const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
      guestOrders.push(orderIdString);
      localStorage.setItem('guest_orders', JSON.stringify(guestOrders));
      alert(`অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! আপনার অর্ডার আইডি: ${orderIdString}। এটি কপি করে রাখুন।`);
    }

    if (user) {
      const res = await fetch(`/api/user/${user.id}`);
      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    }
  };

  const handleVerifyPayment = async (trxId: string, contact: string) => {
    if (!manualPayment.pkg || !manualPayment.uid) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user?.id, 
          package_id: manualPayment.pkg.id, 
          player_uid: manualPayment.uid,
          payment_method: manualPayment.method,
          transaction_id: trxId,
          contact_number: contact
        })
      });
      const data = await res.json();
      if (data.success) {
        refreshUser(data.order_id_string);
        setManualPayment({ ...manualPayment, isOpen: false });
        setPaymentData({ ...paymentData, isOpen: false });
        setSelectedCategory(null);
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("সার্ভারে সমস্যা হচ্ছে, আবার চেষ্টা করুন");
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onOpenAuth={(mode) => {
          setAuthMode({ mode });
          setIsAuthOpen(true);
        }} 
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
      />
      
      <ScrollingNotice />

      <main className="max-w-7xl mx-auto pb-24">
        <HeroSlider />

        <div className="px-4 mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Our Services</h2>
            <div className="h-px flex-1 bg-zinc-800 mx-6 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard title="Free Fire UID Top-up (BD)" icon={Zap} onClick={() => setSelectedCategory("UID Top-up (BD)")} />
            <ServiceCard title="Weekly Membership" icon={CreditCard} onClick={() => setSelectedCategory("Weekly Membership")} />
            <ServiceCard title="Monthly Membership" icon={ShoppingCart} onClick={() => setSelectedCategory("Monthly Membership")} />
            <ServiceCard title="Level Up Pass" icon={ShieldCheck} onClick={() => setSelectedCategory("Level Up Pass")} />
            <ServiceCard title="Special Airdrop" icon={Zap} onClick={() => setSelectedCategory("Special Airdrop")} />
          </div>
        </div>

        <div className="px-4 mt-20">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight uppercase tracking-tighter">Need Help?</h2>
              <p className="text-zinc-400 text-lg mb-8">Our support team is available 24/7 to assist you with your orders or any questions you might have.</p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:opacity-90 transition-all">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
                <a href="#" className="flex items-center gap-2 px-6 py-3 bg-[#0088cc] text-white font-bold rounded-xl hover:opacity-90 transition-all">
                  <Send className="w-5 h-5" /> Telegram
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-zinc-800 rounded-3xl flex items-center justify-center">
              <MessageCircle className="w-24 h-24 text-emerald-500 opacity-20" />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Logo className="h-8" showText orientation="horizontal" />
            </div>
            <p className="text-zinc-500 max-w-sm leading-relaxed">
              The most trusted digital service store for Free Fire gamers in Bangladesh. Fast, secure, and reliable.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Follow Us</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-all cursor-pointer">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-all cursor-pointer">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-600 text-xs">
          © {new Date().getFullYear()} CVV TOP UP CB. All rights reserved. Developed for Free Fire Gamers.
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/20 text-white"
        >
          <MessageCircle className="w-7 h-7" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#0088cc] rounded-full flex items-center justify-center shadow-xl shadow-[#0088cc]/20 text-white"
        >
          <Send className="w-7 h-7" />
        </motion.button>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => { setIsAuthOpen(false); setAuthMode({ mode: 'login' }); }} 
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode.mode}
        initialToken={authMode.token}
      />
      
      {user ? (
        <Dashboard 
          user={user} 
          isOpen={isDashboardOpen} 
          onClose={() => setIsDashboardOpen(false)} 
        />
      ) : (
        <Dashboard 
          user={null} 
          isOpen={isDashboardOpen} 
          onClose={() => setIsDashboardOpen(false)} 
        />
      )}

      <TrackOrderModal 
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
      />

      <OrderModal 
        isOpen={!!selectedCategory} 
        onClose={() => setSelectedCategory(null)} 
        category={selectedCategory || ''} 
        packages={packages}
        user={user}
        onOrderSuccess={refreshUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPayment={(amount, pkg, uid) => setPaymentData({ isOpen: true, amount, pkg, uid })}
      />

      <PaymentGateway 
        isOpen={paymentData.isOpen}
        onClose={() => setPaymentData({ isOpen: false, amount: 0 })}
        amount={paymentData.amount}
        merchantName="CVV TOP UP CB"
        onManualPayment={(method) => setManualPayment({ isOpen: true, method, amount: paymentData.amount, pkg: paymentData.pkg, uid: paymentData.uid })}
      />

      <ManualPaymentVerification 
        isOpen={manualPayment.isOpen}
        onClose={() => setManualPayment({ ...manualPayment, isOpen: false })}
        method={manualPayment.method}
        amount={manualPayment.amount}
        onVerify={handleVerifyPayment}
      />

      {/* Initial Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Welcome to CVV!</h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  Get the fastest Free Fire UID top-ups in Bangladesh. Check out our new Weekly and Monthly membership offers!
                </p>
                <button 
                  onClick={() => setShowPopup(false)}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  START SHOPPING
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
