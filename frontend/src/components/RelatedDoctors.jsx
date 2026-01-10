import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Stethoscope } from "lucide-react";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [relDocs, setRelDocs] = useState([]);

  useEffect(() => {
    if (doctors?.length && speciality) {
      const filtered = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(filtered);
    }
  }, [doctors, speciality, docId]);

  if (!relDocs.length) return null;

  return (
    <div className="flex flex-col items-center gap-6 my-24 px-4 md:mx-10">
      
      {/* --- HEADER SECTION --- */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-px w-8 bg-primary/30" />
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Recommendations</span>
          <div className="h-px w-8 bg-primary/30" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Related <span className="text-primary">Specialists</span>
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Other highly-rated professionals in {speciality}
        </p>
      </div>

      {/* --- DOCTORS GRID --- */}
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-5"
      >
        {relDocs.slice(0, 4).map((item) => {
          const isAvailable = item.available ?? true;

          return (
            <motion.div
              key={item._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group relative bg-white dark:bg-slate-900 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 p-3 cursor-pointer hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-4/3 rounded-[1.8rem] overflow-hidden bg-slate-50 dark:bg-slate-800">
                <img
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  src={item.image}
                  alt={item.name}
                />
                <div className="absolute top-3 left-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-black uppercase ${
                        isAvailable ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
                        {isAvailable ? "Available" : "Away"}
                    </div>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <Stethoscope size={14} className="text-primary" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.speciality}</span>
                </div>

                <h3 className="text-slate-900 dark:text-white text-xl font-black group-hover:text-primary transition-colors truncate">
                  {item.name}
                </h3>

                <div className="mt-5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Consultation</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">View Details</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:-rotate-45 transition-all duration-500">
                        <ChevronRight size={20} />
                    </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default RelatedDoctors;