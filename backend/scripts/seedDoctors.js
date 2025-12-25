// backend/scripts/seedDoctors.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import { doctors } from "./doctorsData.js";

dotenv.config();

const BACKEND_URL = "http://localhost:4000/api/admin/add-doctor";
const ADMIN_TOKEN = process.env.ADMIN_SEED_TOKEN; // temporary admin token

const seedDoctors = async () => {
  for (const doc of doctors) {
    try {
      const formData = new FormData();

      formData.append(
        "image",
        fs.createReadStream(path.join("assets/doctors", doc.image))
      );
      formData.append("name", doc.name);
      formData.append("email", doc.email);
      formData.append("password", doc.password);
      formData.append("speciality", doc.speciality);
      formData.append("degree", doc.degree);
      formData.append("experience", doc.experience);
      formData.append("about", doc.about);
      formData.append("fees", doc.fees);
      formData.append("address", JSON.stringify(doc.address));

      await axios.post(BACKEND_URL, formData, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          ...formData.getHeaders(),
        },
      });

      console.log(`✅ Added: ${doc.name}`);
    } catch (err) {
      console.error(`❌ Failed: ${doc.name}`, err.response?.data || err.message);
    }
  }

  console.log("🎉 Doctor seeding completed");
};

seedDoctors();
