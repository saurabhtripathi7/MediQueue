import appointment_img from "./appointment_img.png";
import header_img from "./header_img.png";
import group_profiles from "./group_profiles.png";
import profile_pic from "./profile_pic.png";
import contact_image from "./contact_image.png";
import about_image from "./about_image.png";
import logo from "./logo.png";
import dropdown_icon from "./dropdown_icon.svg";
import menu_icon from "./menu_icon.svg";
import cross_icon from "./cross_icon.png";
import chats_icon from "./chats_icon.svg";
import verified_icon from "./verified_icon.svg";
import arrow_icon from "./arrow_icon.svg";
import info_icon from "./info_icon.svg";
import upload_icon from "./upload_icon.png";
import stripe_logo from "./stripe_logo.png";
import razorpay_logo from "./razorpay_logo.png";
// import doc1 from "./doc1.png";
// import doc2 from "./doc2.png";
// import doc3 from "./doc3.png";
// import doc4 from "./doc4.png";
// import doc5 from "./doc5.png";
// import doc6 from "./doc6.png";
// import doc7 from "./doc7.png";
// import doc8 from "./doc8.png";
// import doc9 from "./doc9.png";
// import doc10 from "./doc10.png";
// import doc11 from "./doc11.png";
// import doc12 from "./doc12.png";
// import doc13 from "./doc13.png";
// import doc14 from "./doc14.png";
// import doc15 from "./doc15.png";
import doc1 from "./doc1.jpg";
import doc2 from "./doc2.jpg";
import doc3 from "./doc3.jpg";
import doc4 from "./doc4.jpg";
import doc5 from "./doc5.jpg";
import doc6 from "./doc6.jpg";
import doc7 from "./doc7.jpg";
import doc8 from "./doc8.jpg";
import doc9 from "./doc9.jpg";
import doc10 from "./doc10.jpg";
import doc11 from "./doc11.jpg";
import doc12 from "./doc12.jpg";
import doc13 from "./doc13.jpg";
import doc14 from "./doc14.jpg";
import doc15 from "./doc15.jpg";
import doc16 from "./doc16.jpg";
import doc17 from "./doc17.jpg";
import doc18 from "./doc18.jpg";
import doc19 from "./doc19.jpg";
import doc20 from "./doc20.jpg";

import Dermatologist from "./Dermatologist.svg";
import Gastroenterologist from "./Gastroenterologist.svg";
import General_physician from "./General_physician.svg";
import Gynecologist from "./Gynecologist.svg";
import Neurologist from "./Neurologist.svg";
import Pediatricians from "./Pediatricians.svg";

export const assets = {
  appointment_img,
  header_img,
  group_profiles,
  logo,
  chats_icon,
  verified_icon,
  info_icon,
  profile_pic,
  arrow_icon,
  contact_image,
  about_image,
  menu_icon,
  cross_icon,
  dropdown_icon,
  upload_icon,
  stripe_logo,
  razorpay_logo,
};

export const specialityData = [
  {
    speciality: "General physician",
    image: General_physician,
  },
  {
    speciality: "Gynecologist",
    image: Gynecologist,
  },
  {
    speciality: "Dermatologist",
    image: Dermatologist,
  },
  {
    speciality: "Pediatricians",
    image: Pediatricians,
  },
  {
    speciality: "Neurologist",
    image: Neurologist,
  },
  {
    speciality: "Gastroenterologist",
    image: Gastroenterologist,
  },
];

export const doctors = [
  {
    _id: "doc1",
    name: "Dr. Anjali Kapoor",
    image: doc1,
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Kapoor has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 500,
    address: {
      line1: "Gomti Nagar",
      line2: "Lucknow, Uttar Pradesh",
    },
    available: true,
  },
  {
    _id: "doc2",
    name: "Dr. Rajesh Verma",
    image: doc2,
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about: "Dr. Verma has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 600,
    address: {
      line1: "Sector 18",
      line2: "Noida, Uttar Pradesh",
    },
    available: true,
  },
  {
    _id: "doc3",
    name: "Dr. Amit Bansal",
    image: doc3,
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about: "Dr. Bansal has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 300,
    address: {
      line1: "Koramangala",
      line2: "Bengaluru, Karnataka",
    },
    available: true,
  },
  {
    _id: "doc4",
    name: "Dr. Sunita Sharma",
    image: doc4,
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about: "Dr. Sharma has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 400,
    address: {
      line1: "Vasant Kunj",
      line2: "New Delhi, Delhi",
    },
    available: true,
  },
  {
    _id: "doc5",
    name: "Dr. Vikram Singh",
    image: doc5,
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Singh has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 500,
    address: {
      line1: "Civil Lines",
      line2: "Jaipur, Rajasthan",
    },
    available: true,
  },
  {
    _id: "doc6",
    name: "Dr. Rahul Malhotra",
    image: doc6,
    speciality: "Gastroenterologist",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Malhotra has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 500,
    address: {
      line1: "Bandra West",
      line2: "Mumbai, Maharashtra",
    },
    available: true,
  },
  {
    _id: "doc7",
    name: "Dr. Priya Desai",
    image: doc7,
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Desai has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 500,
    address: {
      line1: "Navrangpura",
      line2: "Ahmedabad, Gujarat",
    },
    available: true,
  },
  {
    _id: "doc8",
    name: "Dr. Manoj Kumar",
    image: doc8,
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about: "Dr. Kumar has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 600,
    address: {
      line1: "Salt Lake City",
      line2: "Kolkata, West Bengal",
    },
    available: true,
  },
  {
    _id: "doc9",
    name: "Dr. Neha Gupta",
    image: doc9,
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about: "Dr. Gupta has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 300,
    address: {
      line1: "Jubilee Hills",
      line2: "Hyderabad, Telangana",
    },
    available: true,
  },
  {
    _id: "doc10",
    name: "Dr. Aakash Roy",
    image: doc10,
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about: "Dr. Roy has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 400,
    address: {
      line1: "Anna Nagar",
      line2: "Chennai, Tamil Nadu",
    },
    available: true,
  },
  {
    _id: "doc11",
    name: "Dr. Arun Joshi",
    image: doc11,
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Joshi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 500,
    address: {
      line1: "Shivaji Nagar",
      line2: "Pune, Maharashtra",
    },
    available: true,
  },
  {
    _id: "doc12",
    name: "Dr. Sameera Khan",
    image: doc12,
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Khan has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 500,
    address: {
      line1: "Aligarh Road",
      line2: "Agra, Uttar Pradesh",
    },
    available: true,
  },
  {
    _id: "doc13",
    name: "Dr. Vivek Chawla",
    image: doc13,
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Chawla has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 500,
    address: {
      line1: "Model Town",
      line2: "Ludhiana, Punjab",
    },
    available: true,
  },
  {
    _id: "doc14",
    name: "Dr. Ravina Mehta",
    image: doc14,
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about: "Dr. Mehta has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 600,
    address: {
      line1: "Maninagar",
      line2: "Surat, Gujarat",
    },
    available: true,
  },
  {
    _id: "doc15",
    name: "Dr. Suresh Reddy",
    image: doc15,
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about: "Dr. Reddy has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 300,
    address: {
      line1: "Banjara Hills",
      line2: "Hyderabad, Telangana",
    },
    available: true,
  },
  {
    _id: "doc16",
    name: "Dr. Deepak Sharma",
    image: doc16,
    speciality: "General physician",
    degree: "MBBS",
    experience: "5 Years",
    about: "Dr. Sharma focuses on holistic primary care with strong emphasis on lifestyle management, preventive health, and early diagnosis of chronic illnesses.",
    fees: 400,
    address: {
      line1: "Indiranagar",
      line2: "Bengaluru, Karnataka",
    },
    available: true,
  },
  {
    _id: "doc17",
    name: "Dr. Meera Nanda",
    image: doc17,
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "6 Years",
    about: "Dr. Nanda specializes in neurological disorders including migraines, epilepsy, and nerve-related conditions with patient-centric care.",
    fees: 700,
    address: {
      line1: "Saket",
      line2: "New Delhi, Delhi",
    },
    available: true,
  },
  {
    _id: "doc18",
    name: "Dr. Avni Jain",
    image: doc18,
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Jain provides comprehensive women’s healthcare with expertise in pregnancy care, fertility counseling, and preventive gynecology.",
    fees: 600,
    address: {
      line1: "Malviya Nagar",
      line2: "Jaipur, Rajasthan",
    },
    available: true,
  },
  {
    _id: "doc19",
    name: "Dr. Ritu Agarwal",
    image: doc19,
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "3 Years",
    about: "Dr. Agarwal treats skin, hair, and nail conditions with a modern approach combining clinical dermatology and cosmetic care.",
    fees: 500,
    address: {
      line1: "Hazaratganj",
      line2: "Lucknow, Uttar Pradesh",
    },
    available: true,
  },
  {
    _id: "doc20",
    name: "Dr. Vineeta Choudhary",
    image: doc20,
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "5 Years",
    about: "Dr. Choudhary is dedicated to child healthcare, focusing on growth monitoring, vaccinations, and pediatric wellness.",
    fees: 450,
    address: {
      line1: "Civil Lines",
      line2: "Prayagraj, Uttar Pradesh",
    },
    available: true,
  },
];
